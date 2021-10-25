import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { ReglagesPage } from '../reglages/reglages.page';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router } from '@angular/router';
import { ActivitiesPage } from '../activities/activities.page';

@Component({
  selector: 'app-preseance',
  templateUrl: './preseance.page.html',
  styleUrls: ['./preseance.page.scss'],
})
export class PreseancePage implements OnInit {
  @ViewChild('mySlider') slides: IonSlides;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };
  base64;
  current = 90;
  max = 100;
  isActif: boolean = false;
  activite = { name: 'Sélectionnez une activité', image: 'assets/images/questionmark.svg', padding2: '34px 40px;', width2: '25px' }
  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
    let item = localStorage.getItem('activite');
    if (item) {
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
      if (value) {
        this.activite = value
        this.isActif = true;
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


  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.base64 = theActualPicture;
  }

  start() {
    if (this.isActif) {
      let choice = JSON.parse(localStorage.getItem('reglages'));
      if (!choice)
        this.router.navigate(['/session-now/demarrage']);
      else {
        if (choice.compteRebour == true) {
          this.router.navigate(['/session-now/counter']);
        }
        else {
          this.router.navigate(['/session-now/demarrage']);
        }
      }
    }
  }

  swipeNext() {

    this.slides.getActiveIndex().then((index: number) => {
      if (index != 2) this.slides.slideNext();
      else this.slides.slideTo(0);
    });

  }
  retour() {
    window.history.back();
  }
}
