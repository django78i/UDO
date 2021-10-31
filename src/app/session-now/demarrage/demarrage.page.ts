import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import { ListMetricsPage } from '../list-metrics/list-metrics.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { ReglagesPage } from '../reglages/reglages.page';
import { Router } from '@angular/router';
import { Health } from '@ionic-native/health/ngx';
import { Platform } from '@ionic/angular';
import { DonneesPriveComponent } from '../donnees-prive/donnees-prive.component';
import {SessionNowService} from '../../services/session-now-service.service';
import { AddContenuComponent } from '../add-contenu/add-contenu.component';
import moment from 'moment';



@Component({
  selector: 'app-demarrage',
  templateUrl: './demarrage.page.html',
  styleUrls: ['./demarrage.page.scss'],
})
export class DemarragePage implements OnInit {

  listElement: any = [];
  base64;
  t: any;
  ms = 0;
  s = 0;
  mn = 0;
  h = 0;
  status = 'play';
  activite: any;
  pause = false;
  image: any;
  listChoix = [
    {
      img: 'assets/images/distance.svg',
      nombre: '0',
      name: 'Distance',
      exposant: 'KM',
      fieldname: 'distance'
    },
    {
      img: 'assets/images/pas.svg',
      nombre: '0',
      name: 'Nombre de pas',
      exposant: '',
      fieldname: 'steps'
    },
    {
      img: 'assets/images/coeur.svg',
      nombre: '0',
      name: 'BPM',
      exposant: '',
      fieldname: 'heart_rate'
    },
    {
      img: 'assets/images/calorie.svg',
      nombre: '0',
      name: 'Calories',
      exposant: 'CAL',
      fieldname: 'calories'
    },
  ];
  sessionNow = new SessionNowModel();
  listSettings = [];
  user: any;
  reactions = 0;
  interval;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private toastCtrl: ToastController,
    public navController: NavController,
    private health: Health,
    private platform: Platform,
    private snService: SessionNowService,
    public alertController: AlertController
  ) {
    this.image = JSON.parse(localStorage.getItem('image'));
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this.presentAlertConfirm();
    });
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getSessionNow();
  }

  async getSessionNow() {

    this.interval = setInterval(() => {
      let sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
      if (sessionNow) {
        this.snService.find(sessionNow.uid, 'session-now').then((resp: any) => {
          let value = resp._document.data.value.mapValue.fields;
          if (value.reactions.arrayValue) {
            this.reactions = value.reactions.arrayValue.values?.length;
            this.sessionNow.reactions = value.reactions.arrayValue.values;
           // localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
          }else{
            this.reactions = 0;
          }
          this.sessionNow.reactions = value.reactions.arrayValue.values;
          localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
        });

      }
    }, 10000);
  }
  async presentAlertConfirm() {
    this.stop();
    const alert = await this.alertController.create({
      header: 'Confirmation',
      mode: 'ios',
      message: 'Voulez vous vraiment arreter cette seance now',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.start();
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
  ngOnInit() {
    const stSettings = localStorage.getItem('reglages');
    if(stSettings){
      this.listSettings = JSON.parse(stSettings);
    }
    let valPause = localStorage.getItem('pause');
    if (valPause) {
      this.pause = true;
    }
    this.start();
    this.checkPlatformReady();

    this.listElement = [
      {
        img: 'assets/images/distance.svg',
        nombre: '0',
        name: 'Distance',
        exposant: 'KM',
        fieldname: 'distance'
      },
      {
        img: 'assets/images/pas.svg',
        nombre: '0',
        name: 'Nombre de pas',
        exposant: '',
        fieldname: 'steps'
      },
      {
        img: 'assets/images/coeur.svg',
        nombre: '0',
        name: 'BPM',
        exposant: '',
        fieldname: 'heart_rate'
      },
      {
        img: 'assets/images/calorie.svg',
        nombre: '0',
        name: 'Calories',
        exposant: 'CAL',
        fieldname: 'calories'
      },
    ];
    let item = JSON.parse(localStorage.getItem('activite'));
    if (item) {
      this.activite = item;
    }
    let choix = localStorage.getItem('choix');
    if (!choix) {
      localStorage.setItem('choix', JSON.stringify(this.listChoix));
    } else {
      this.listElement = JSON.parse(localStorage.getItem('choix'));
    }
    this.sessionNow.startDate=new Date().toISOString();
    this.sessionNow.activity=this.activite?.name;
    if(this.listSettings!==null && this.listSettings!==undefined && this.listSettings.length!==0){
      if(!this.listSettings['modePrive']){
        this.sessionNow.mode='privée';
      }else{
        this.sessionNow.mode='public';
      }
    } else {
      this.sessionNow.mode = 'public';
    }
    this.sessionNow.isLive = true;
    // this.sessionNow.uid = "ef8f7e570c5f3be4f726ce612224a350";
    this.snService.create(this.sessionNow, 'session-now')
      .then(res => {
        this.sessionNow.uid = res;
        localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
        this.sessionNow.photo = this.image ? this.image.picture : '';
        this.sessionNow.username = this.user ? this.user.userName : '';
        this.sessionNow.userId = this.user ? this.user.uid : '';
        let sessionNow = { ...this.sessionNow };
        sessionNow['type'] = 'session-now';

        this.snService.create(sessionNow, 'post-session-now')
          .then(resPost => {
            console.log("je suis la");
            // this.sessionNow.uid = res;
            // localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
          })


      })
      .catch(err => console.error(err));
    localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
  }
  async checkPlatformReady() {
    const ready = !!await this.platform.ready();
    if (ready) {
      // Use plugin functions here
      this.health.requestAuthorization([
        'distance', 'nutrition',  //read and write permissions
        {
          read: ['steps', 'height', 'weight'],//read only permission
          write: ['height', 'weight']  //write only permission
        }
      ])
        .then(res => this.getMetrics())
        .catch(e => console.log('error1 ' + e));
    }

  }
  getMetrics() {
    if (this.status === 'play') {
      for (let item of this.listElement) {
        this.queryMetrics(item.fieldname, item);
      }
      let that = this;
      // this.getMetrics();
      // @ts-ignore
       setTimeout(() => { that.getMetrics(); }, 1000);
    }
  }
  // @ts-ignore
  queryMetrics(metric, item) {
    console.log(new Date(this.sessionNow.startDate));
    if (metric === 'steps' || metric === 'distance') {
      this.health.queryAggregated({
        startDate: new Date(this.sessionNow.startDate), // three days ago
        endDate: new Date(), // now
        dataType: metric,
        bucket: 'hour',
        //limit: 1000
      }).then(res => {

        item.nombre = res.length > 0 ? (Math.round((parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100) / 100) : '0';
        if(metric === 'distance'){
          if(item.nombre!==0 && item.nombre!==undefined && item.nombre!==''){
            item.nombre= Math.round(item.nombre / 100) / 10;
          }
        }
        console.log('res', res);
      })
        .catch(e => console.log('error3 ', e));
    }
    else {
      this.health.query({
        startDate: new Date(this.sessionNow.startDate), // three days ago
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
  checkPause() {
    this.pause = true;
    localStorage.setItem('pause', '' + this.pause);
  }

  async publier() {

    const modal = await this.modalCtrl.create({
      component: DonneesPriveComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    return await modal.present();
  }
  displayRecap() {
    this.stop();
    const listMetricAuhorised=['steps','distance','calories','activity','height','weight'];
    this.sessionNow.isLive=false;
    this.sessionNow.duration=this.mn+':'+this.s;
    for (let metric of this.listElement){
      for(const metricAutorised of listMetricAuhorised){
        if(metric.fieldname===metricAutorised){
          this.sessionNow.metrics.push(metric);
        }
      }
    }

    this.sessionNow.endDate=new Date().toISOString().split('T')[0] +' '+new Date().toISOString().split('T')[1].split('.')[0];
    localStorage.setItem('counter', JSON.stringify({ mn: this.mn, s: this.s }));
    localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));

    this.router.navigate(['session-now/resultat']);
  }

  async showMessage(message, type) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: type,
      position: 'bottom'
    });
    toast.present();
  }
  information() {
    this.router.navigate(['session-now/help']);
  }

  async notification() {
    localStorage.setItem('counter', JSON.stringify({ mn: this.mn, s: this.s }));
    const modal = await this.modalCtrl.create({
      component: NotificationsPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {

      }
    });
    modal.onDidDismiss().then((data: any) => {

    });
    return await modal.present();

  }
  async addContenu() {
    const modal = await this.modalCtrl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
      this.base64 =data.data;
    });
    return await modal.present();

  }

  async reglage() {
    localStorage.setItem('counter', JSON.stringify({ mn: this.mn, s: this.s }));
    const modal = await this.modalCtrl.create({
      component: ReglagesPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {

      }
    });
    modal.onDidDismiss().then((data: any) => {

    });
    return await modal.present();

  }

  /*La fonction update_chrono incrémente le nombre de millisecondes par 1 <==> 1*cadence = 100 */
  updateChrono() {
    this.ms += 1;
    /*si ms=10 <==> ms*cadence = 1000ms <==> 1s alors on incrémente le nombre de secondes*/
    if (this.ms === 10) {
      this.ms = 1;
      this.s += 1;
    }
    /*on teste si s=60 pour incrémenter le nombre de minute*/
    if (this.s === 60) {
      this.s = 0;
      this.mn += 1;
    }
    if (this.mn === 60) {
      this.mn = 0;
      this.h += 1;
    }
  }
  start() {
    this.status = 'play';
    this.t = setInterval(() => { this.updateChrono(); }, 100);
    // btn_start.disabled=true;
  }
  stop() {
    this.status = 'pause';
    clearInterval(this.t);
    //btn_start.disabled=false;
  }

  async choix(item, index) {
    const modal = await this.modalCtrl.create({
      component: ListMetricsPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {
        choix: item
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        let value = data.data;
        for (let el of this.listElement) {
          if (el.name == value.name) {
            this.showMessage('Cette activité est déjà dans la liste', 'warning')
            return;
          }

        }
        for (let val of this.listChoix) {
          if (value.name == val.name) {
            value = val;
            this.listElement[index] = val;
          } else {
            this.listElement[index] = value;
          }
        }
        localStorage.setItem('choix', JSON.stringify(this.listElement));
      }
    });
    return await modal.present();

  }
}
export class SessionNowModel{
  uid: string;
  startDate: string;
  endDate: string;
  activity: string;
  userId: string;
  photo: string;
  username: string;
  reactionNumber: number;
  reactions= [];
  metrics= [

  ];
  score: number;
  mode: string; // 'private or public'
  championant: string ; // nulllable true
  isLive: boolean ; // true or false
  duration: string;
  comment: string;
}
export class PostModel{
  postedAt: string;
  postedBy: string;
  sessionUUID: string;
  picture: string;
}
