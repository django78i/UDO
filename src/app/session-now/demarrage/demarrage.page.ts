import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ListMetricsPage } from '../list-metrics/list-metrics.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { Camera ,CameraOptions } from '@ionic-native/camera/ngx';
import { ReglagesPage } from '../reglages/reglages.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demarrage',
  templateUrl: './demarrage.page.html',
  styleUrls: ['./demarrage.page.scss'],
})
export class DemarragePage implements OnInit {
  listElement :any = [];
  listChoix = [{img:"assets/images/distance.svg",nombre:"1.78",name:"Distance" ,exposant:"KM"},{img:"assets/images/pas.svg",nombre:"2617",name:"Nombre de pas",exposant:""},{img:"assets/images/coeur.svg",nombre:"135",name:"BPM",exposant:""},{img:"assets/images/calorie.svg",nombre:"250",name:"Calories",exposant:"CAL"}];
  constructor(private modalCtrl:ModalController,private router:Router,
    private toastCtrl : ToastController, private camera:Camera) { }

  ngOnInit() {
    this.listElement = [{img:"assets/images/distance.svg",nombre:"1.78",name:"Distance" ,exposant:"KM"},{img:"assets/images/pas.svg",nombre:"2617",name:"Nombre de pas",exposant:""},{img:"assets/images/coeur.svg",nombre:"135",name:"BPM",exposant:""},{img:"assets/images/calorie.svg",nombre:"250",name:"Calories",exposant:"CAL"}]
    let choix = localStorage.getItem('choix');
    if(!choix){
      localStorage.setItem('choix',JSON.stringify(this.listChoix));
    }else{
      this.listElement = JSON.parse(localStorage.getItem('choix'));
    }
  }
  async choix(item,index) {
    const modal = await this.modalCtrl.create({
      component: ListMetricsPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {
        choix:item
      }
    });
    modal.onDidDismiss().then((data: any) => {
      if(data.data){
        let value = data.data;
        for(let el of this.listElement){
          if(el.name == value.name){
            this.showMessage('Cette activité est déjà dans la liste','warning')
            return;
          }

        }
        for(let val of this.listChoix){
          if(value.name == val.name){
            value = val;
            this.listElement[index]=val;
          }else{
            this.listElement[index]=value;
          }
        }
        localStorage.setItem('choix',JSON.stringify(this.listElement));
      }
    });
    return await modal.present();

  }
  async showMessage(message, type) {
    const toast = await this.toastCtrl.create({
         message,
         duration: 4000,
         color: type,
         position:'bottom'
       });
    toast.present();
  }
 information() {
    this.router.navigate(['aide']);
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
  openCamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
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
}
