import { Component, OnInit } from '@angular/core';
import {AppLauncher, AppLauncherOptions} from '@ionic-native/app-launcher/ngx';
import {AlertController, Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from "@angular/router";
import {SessionNowService} from "../../../services/session-now-service.service";
import {Health} from "@ionic-native/health/ngx";

@Component({
  selector: 'app-external-session-now-loader',
  templateUrl: './external-session-now-loader.page.html',
  styleUrls: ['./external-session-now-loader.page.scss'],
})
export class ExternalSessionNowLoaderPage implements OnInit {

  listExtenalApp=[];
  app: any;
  status='Connexion en cours';
  sessionNow: any;
  mn: number;
  s: number;
  listElement: any = [];
  constructor( private health: Health,
               private snService: SessionNowService,
               private alertController: AlertController,
               private router: Router,
               private platform: Platform,
               private appLauncher: AppLauncher,
               private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {this.app=params["params"];});
    let that = this;
    setTimeout(()=>{
      // on enregistre la date et l'heure de demarrage de la session-now-externe
      this.sessionNow={
        startDate: new Date().toISOString(),
        appId:this.app.appId,
        appName:this.app.name,
        isLive:true,
      };
      localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
      that.status='Connecté' ;
      this.openExternalApp(this.app.appId,this.app.appName) ;
      },3000);
  }

  /**
   * cette fonction permet de verifier si l'application a le droit d'ouvrir une application externe
   * @param appId
   * @param appName
   */
  openExternalApp(appId: string,appName: string){
    const  options: AppLauncherOptions = {};
    if(this.platform.is('ios')) {
      options.uri = appId ; // 'fb://'
    } else {
      options.packageName = appId;
    }

    this.appLauncher.canLaunch(options)
      .then((canLaunch: boolean) => this.launchExternalApp(options,appName))
      .catch((error: any) => console.error(appName+ ' is not available'));
  }

  /**
   * Cette fonction ouvre l'application externe
   * @param options
   * @param appName
   */
  launchExternalApp(options,appName){
    this.sessionNow= JSON.parse(localStorage.getItem('sessionNow')) ;
    this.snService.create(this.sessionNow,'session-now')
      .then(res=>{
        this.sessionNow.uid=res;
        localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow)) ;
      })
      .catch(err=>console.error(err)) ;

    this.appLauncher.launch(options)
      .then((launch: boolean)=>{console.log(appName +' is open'); })
      .catch((error: any) => console.error('Error when trying to open '+appName));
  }
  gotoHome(){
    this.router.navigate(['tabs']);
  }

  async presentAlertConfirm() {

    const alert = await this.alertController.create({
      header: 'Confirmation',
      mode:'ios',
      message: 'Voulez vous vraiment arreter cette seance now externe',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Oui',
          handler: () => {
            this.displayRecap();
          }
        }
      ]
    });

    await alert.present();
  }


  displayRecap() {
    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    const listMetricAuhorised=['steps','distance','height','weight','calories'];
    this.sessionNow.endDate=new Date().toISOString();
    const diff=this.dateDiff(new Date(this.sessionNow.startDate),new Date(this.sessionNow.endDate));
   // console.log(this.sessionNow);
    this.mn=diff.min;
    this.s=diff.sec;
    this.sessionNow.isLive=false;
    this.sessionNow.duration=this.mn+':'+this.s;
    for (let metric of this.listElement){
      for(let metricAutorised of listMetricAuhorised){
        if(metric.fieldname===metricAutorised){
          this.queryMetrics(metric.fieldname, metric);
          this.sessionNow.metrics.push(metric);
        }
      }
    }
    localStorage.setItem('counter', JSON.stringify({ mn: this.mn, s: this.s }));
    localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
    this.router.navigate(['session-now/resultat']);
  }
  queryMetrics(metric, item) {
    if (metric === 'steps' || metric === 'distance') {
      this.health.queryAggregated({
        startDate: new Date(this.sessionNow.startDate), // three days ago
        endDate: new Date(), // now
        dataType: metric,
        bucket: 'day',
        //limit: 1000
      }).then(res => {
        item.nombre = res.length > 0 ? (Math.round((parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100) / 100) : '0';
        console.log('res', res);
      })
        .catch(e => console.log('error3 ', e));
    }
    else {
      this.health.query({
        startDate: new Date(this.sessionNow.startDate) , // three days ago
        endDate: new Date(), // now
        dataType: metric,
        limit: 100
      }).then(res => {
        item.nombre = res.length > 0 ? (Math.round((parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100) / 100) : '0';
        console.log('res', res);
      })
        .catch(e => console.log('error1 ', e));
    }
  }

   dateDiff(date1, date2){
    let diff={sec:0,min:0,hour:0,day:0} ;                           // Initialisation du retour
    let tmp = date2 - date1;

    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;

    return diff;
  }
}
