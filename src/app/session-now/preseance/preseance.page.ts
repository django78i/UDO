import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { ReglagesPage } from '../reglages/reglages.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { ActivitiesPage } from '../activities/activities.page';

@Component({
  selector: 'app-preseance',
  templateUrl: './preseance.page.html',
  styleUrls: ['./preseance.page.scss'],
})
export class PreseancePage implements OnInit {
  @ViewChild('mySlider')  slides: IonSlides;
 slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };
  current=90;
  max=100;
  isActif:boolean =false;
  activite={name:'Sélectionnez une activité',image:'assets/images/questionmark.svg',padding2:'34px 40px;',width2:'25px'}
  constructor(private modalCtrl:ModalController,private camera: Camera,
    private router:Router) { }

  ngOnInit() {
    let item = localStorage.getItem('activite');
    if(item){
      this.activite = JSON.parse(item);
      this.isActif = true;
    }
  }
  async choisirActivite() {
    const modal = await this.modalCtrl.create({
      component: ActivitiesPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {

      }
    });
    modal.onDidDismiss().then((data: any) => {
     let value = JSON.parse(localStorage.getItem('activite'));
     if(value) {
      this.activite =value
      this.isActif=true;
    }
    });
    return await modal.present();

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

  information() {
    this.router.navigate(['session-now/help']);
  }


  openCamera(){
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
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

  start(){
    if(this.isActif){
      let choice =JSON.parse(localStorage.getItem('reglages'));
      if(!choice)
        this.router.navigate(['/session-now/counter']);
      else{
        if(choice.compteRebour == true){
          this.router.navigate(['/session-now/demarrage']);
        }else{
          this.router.navigate(['/session-now/counter']);
        }
      }  
    }
  }

  swipeNext(){
    
    this.slides.getActiveIndex().then((index: number) => {
      if(index != 2) this.slides.slideNext();
      else this.slides.slideTo(0);
  });
    
  }
  retour(){
    window.history.back();
  }
}
