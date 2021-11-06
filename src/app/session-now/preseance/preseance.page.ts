import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavController } from '@ionic/angular';
import { ReglagesPage } from '../reglages/reglages.page';
import { Router } from '@angular/router';
import { ActivitiesPage } from '../activities/activities.page';
import { AddPostContenuComponent } from '../add-post-contenu/add-post-contenu.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
    autoplay: false,
  };
  base64: any;
  current = 90;
  max = 100;
  isActif: boolean = false;
  activite = {
    name: 'Sélectionnez une activité',
    image: 'assets/images/questionmark.svg',
    padding2: '34px 40px;',
    width2: '25px',
  };
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public navCtl: NavController
  ) {}

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
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => {
      let value = JSON.parse(localStorage.getItem('activite'));
      if (value) {
        this.activite = value;
        this.isActif = true;
      }
    });
    return await modal.present();
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

  information() {
    this.router.navigate(['session-now/help']);
  }

  async addContenu() {
    console.log(this.base64);
    const modal = await this.modalCtrl.create({
      component: AddPostContenuComponent,
      cssClass: 'my-custom-contenu-modal',
      componentProps: {
        picture: this.base64,
        activity: this.activite,
      },
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }
  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
      //  saveToGallery: true
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.base64 = theActualPicture;
    // localStorage.setItem('picture', theActualPicture);
    if (this.base64) {
      this.addContenu();
    }
    // this.modalCtr.dismiss(this.base64Image);
  }
  start() {
    if (this.isActif) {
      let choice = JSON.parse(localStorage.getItem('reglages'));
      if (!choice) this.router.navigate(['/session-now/demarrage']);
      else {
        if (choice.compteRebour == true) {
          this.router.navigate(['/session-now/counter']);
        } else {
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
    this.navCtl.navigateBack('tabs/tab1');
  }
}
