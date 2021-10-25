import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import { ListMetricsPage } from '../list-metrics/list-metrics.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ReglagesPage } from '../reglages/reglages.page';
import { Router } from '@angular/router';
import { Health } from '@ionic-native/health/ngx';
import { Platform } from '@ionic/angular';
import { DonneesPriveComponent } from '../donnees-prive/donnees-prive.component';
import {SessionNowService} from '../../services/session-now-service.service';



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

  listChoix = [
    {
      img: 'assets/images/distance.svg',
      nombre: '1.78',
      name: 'Distance',
      exposant: 'KM',
      fieldname: 'distance'
    },
    {
      img: 'assets/images/pas.svg',
      nombre: '2617',
      name: 'Nombre de pas',
      exposant: '',
      fieldname: 'steps'
    },
    {
      img: 'assets/images/coeur.svg',
      nombre: '135',
      name: 'BPM',
      exposant: '',
      fieldname: 'height'
    },
    {
      img: 'assets/images/calorie.svg',
      nombre: '250',
      name: 'Calories',
      exposant: 'CAL',
      fieldname: 'weight'
    },
  ];
  sessionNow= new SessionNowModel();
  listSettings=[];
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

    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
       this.presentAlertConfirm();
    });
  }
  async presentAlertConfirm() {
    this.stop();
    const alert = await this.alertController.create({
      header: 'Confirmation',
      mode:'ios',
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
        nombre: '1.78',
        name: 'Distance',
        exposant: 'KM',
        fieldname: 'distance'
      },
      {
        img: 'assets/images/pas.svg',
        nombre: '2617',
        name: 'Nombre de pas',
        exposant: '',
        fieldname: 'steps'
      },
      {
        img: 'assets/images/coeur.svg',
        nombre: '135',
        name: 'BPM',
        exposant: '',
        fieldname: 'height'
      },
      {
        img: 'assets/images/calorie.svg',
        nombre: '250',
        name: 'Calories',
        exposant: 'CAL',
        fieldname: 'weight'
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
    this.sessionNow.startDate=new Date().toISOString().split('T')[0] +' '+new Date().toISOString().split('T')[1].split('.')[0];
    this.sessionNow.activity=this.activite?.name;
    if(this.listSettings!==null && this.listSettings!==undefined && this.listSettings.length!==0){
      if(!this.listSettings['modePrive']){
        this.sessionNow.mode='privée';
      }else{
        this.sessionNow.mode='public';
      }
    }else{
      this.sessionNow.mode='public';
    }
    this.sessionNow.isLive=true;
    this.snService.create(this.sessionNow,'session-now')
      .then(res=>{this.sessionNow.uid=res;})
      .catch(err=>console.error(err));
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
    if(this.status==='play'){
      for (let item of this.listElement) {
        this.queryMetrics(item.fieldname, item);
      }
      let that = this;
      // this.getMetrics();
      // @ts-ignore
      // setTimeout(() => { that.getMetrics(); }, 1000);
    }
  }
  // @ts-ignore
  queryMetrics(metric, item) {
    if (metric === 'steps' || metric === 'distance') {
      this.health.queryAggregated({
        startDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // three days ago
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
        startDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: metric,
        limit: 100
      }).then(res => {
        item.nombre = res.length > 0 ? (Math.round((parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100) / 100) : '0';
        console.log('res', res);
      })
        .catch(e => console.log('error1 ', e));
    }
    this.health.query({
      startDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'steps',
      limit: 1000
    }).then(res => {
      item.nombre = res.length > 0 ? (Math.round((parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100) / 100) : '0';
      console.log('res', res);
    })
      .catch(e => console.log('error1 ', e));
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
    let listMetricAuhorised=['steps','distance','height','weight'];
    this.sessionNow.isLive=false;
    this.sessionNow.duration=this.mn+':'+this.s;
    for (let metric of this.listElement){
      for(let metricAutorised of listMetricAuhorised){
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
  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.base64 = theActualPicture;
    console.log('image', this.base64);


  }

  async reglage() {
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
