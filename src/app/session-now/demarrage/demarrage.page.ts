import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { ListMetricsPage } from '../list-metrics/list-metrics.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ReglagesPage } from '../reglages/reglages.page';
import { Router } from '@angular/router';
import { Health } from '@ionic-native/health/ngx';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-demarrage',
  templateUrl: './demarrage.page.html',
  styleUrls: ['./demarrage.page.scss'],
})
export class DemarragePage implements OnInit {
  listElement: any = [];
   t: any;
   ms = 0;
   s = 0;
   mn = 0;
   h = 0;
   status='play';
//Source : www.exelib.net
  listChoix = [
    {
      img: 'assets/images/distance.svg',
      nombre: '1.78',
      name: 'Distance',
      exposant: 'KM',
      fieldname:'distance'
    },
    {
      img: 'assets/images/pas.svg',
      nombre: '2617',
      name: 'Nombre de pas',
      exposant: '',
      fieldname:'steps'
    },
    {
      img: 'assets/images/coeur.svg',
      nombre: '135',
      name: 'BPM',
      exposant: '',
      fieldname:'height'
    },
    {
      img: 'assets/images/calorie.svg',
      nombre: '250',
      name: 'Calories',
      exposant: 'CAL',
      fieldname:'weight'
    },
  ];
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private toastCtrl: ToastController,
    private camera: Camera,
    public  navController: NavController,
    private health: Health,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.start();
    this.checkPlatformReady();

    this.listElement = [
      {
        img: 'assets/images/distance.svg',
        nombre: '1.78',
        name: 'Distance',
        exposant: 'KM',
        fieldname:'distance'
      },
      {
        img: 'assets/images/pas.svg',
        nombre: '2617',
        name: 'Nombre de pas',
        exposant: '',
        fieldname:'steps'
      },
      {
        img: 'assets/images/coeur.svg',
        nombre: '135',
        name: 'BPM',
        exposant: '',
        fieldname:'height'
      },
      {
        img: 'assets/images/calorie.svg',
        nombre: '250',
        name: 'Calories',
        exposant: 'CAL',
        fieldname:'weight'
      },
    ];
    let choix = localStorage.getItem('choix');
    if (!choix) {
      localStorage.setItem('choix', JSON.stringify(this.listChoix));
    } else {
      this.listElement = JSON.parse(localStorage.getItem('choix'));
    }
  }
  async checkPlatformReady() {
    const ready = !!await this.platform.ready();
    if (ready) {
// Use plugin functions here
      this.health.requestAuthorization([
        'distance', 'nutrition',  //read and write permissions
        {
          read: ['steps','height', 'weight'],//read only permission
          write: ['height', 'weight']  //write only permission
        }
      ])
        .then(res => this.getMetrics())
        .catch(e => console.log('error1 '+e));
    }

  }
  getMetrics(){
    for (let item of this.listElement){
     this.queryMetrics(item.fieldname,item);
    }
    let that=this;
    // this.getMetrics();
    // @ts-ignore
     setTimeout(()=>{that.getMetrics();},1000);
  }
  // @ts-ignore
  queryMetrics(metric,item){
    if (metric==='steps' || metric==='distance' ){
      this.health.queryAggregated({
        startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: metric,
        bucket:'day',
        //limit: 1000
      }).then(res=>{
        item.nombre=res.length>0?(Math.round((parseFloat(res[res.length-1]?.value) + Number.EPSILON) * 100) / 100):'0';
        console.log('res',res);
      })
        .catch(e => console.log('error3 ', e));
    }
    else{
      this.health.query({
        startDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // three days ago
        endDate: new Date(), // now
        dataType: metric,
        limit: 100
      }).then(res=>{
        item.nombre=res.length>0?(Math.round((parseFloat(res[res.length-1]?.value) + Number.EPSILON) * 100) / 100):'0';
        console.log('res',res);})
        .catch(e => console.log('error1 ',e));
    }
  }
  async choix(item, index) {
    const modal = await this.modalCtrl.create({
      component: ListMetricsPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {
        choix: item,
      },
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        let value = data.data;
        for (let el of this.listElement) {
          if (el.name == value.name) {
            this.showMessage(
              'Cette activité est déjà dans la liste',
              'warning'
            );
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
  async showMessage(message, type) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: type,
      position: 'bottom',
    });
    toast.present();
  }
  information() {
    this.router.navigate([['session-now/aide']]);
  }

  async notification() {
    const modal = await this.modalCtrl.create({
      component: NotificationsPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }
  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData;
      },
      (err) => {
        // Handle error
      }
    );
  }
  async reglage() {
    const modal = await this.modalCtrl.create({
      component: ReglagesPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  back() {
    this.navController.navigateForward(['tabs/tab3']);
  }
  /*La fonction update_chrono incrémente le nombre de millisecondes par 1 <==> 1*cadence = 100 */
  updateChrono(){
    this.ms+=1;
    /*si ms=10 <==> ms*cadence = 1000ms <==> 1s alors on incrémente le nombre de secondes*/
    if(this.ms===10){
      this.ms=1;
      this.s+=1;
    }
    /*on teste si s=60 pour incrémenter le nombre de minute*/
    if(this.s===60){
      this.s=0;
      this.mn+=1;
    }
    if(this.mn===60){
      this.mn=0;
      this.h+=1;
    }
  }
   start(){
     this.status='play';
    this.t =setInterval(()=> {this.updateChrono(); },100);
   // btn_start.disabled=true;
  }
  stop(){
    this.status='pause';
    clearInterval(this.t);
   //btn_start.disabled=false;
  }
//Source : www.exelib.net
}
