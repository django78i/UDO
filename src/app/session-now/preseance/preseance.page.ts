import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavController } from '@ionic/angular';
import { ReglagesPage } from '../reglages/reglages.page';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivitiesPage } from '../activities/activities.page';
import { AddPostContenuComponent } from '../add-post-contenu/add-post-contenu.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-preseance',
  templateUrl: './preseance.page.html',
  styleUrls: ['./preseance.page.scss'],
})
export class PreseancePage implements OnInit {
  @ViewChild('mySlider') slides: IonSlides;
  slideOptsOne = {
    initialSlide: 1,
    slidesPerView: 1,
    autoplay: false,
  };
  base64: any;
  current = 90;
  max = 100;
  isActif = false;
  titleCurrentPage = '';
  categoryId: string;
  activite = {
    name: 'Sélectionnez une activité',
    image: 'assets/images/questionmark.svg',
    padding2: '34px 40px;',
    width2: '25px',
  };
  mode = '';
  modeClasse = '';
  demarrage = '';
  type: string;
  categoryName: string;
  challengeStatus: number;
  challengeUnity: string;

  //...

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private router: Router,
    public navCtl: NavController,
    private camera: Camera
  ) {
    setInterval(() => {
      if (localStorage.getItem('mode')) {
        if (localStorage.getItem('mode') === 'landscape') {
          this.mode = 'landscape';
          this.modeClasse = 'preseanceSlideLands';
          this.demarrage = 'demarrageLands';
        } else {
          this.mode = 'portrait';
          this.modeClasse = 'preseanceSlide';
          this.demarrage = 'demarrage';
        }
      } else {
        this.modeClasse = 'preseanceSlide';
        this.demarrage = 'demarrage';
      }
    }, 100);
  }

  ngOnInit() {
    this.challengeStatus = 90;
    this.challengeUnity = '%';
    this.categoryName = '';
    this.categoryId = '';
    this.route.queryParams.subscribe((params) => {
      this.type = params.type;
      console.log(params);
      if (params.challengeStatus) {
        this.challengeStatus = params.challengeStatus;
      }
      if (params.competitionName) {
        this.categoryName = params.competitionName;
      }
      if (params.categoryId) {
        this.categoryId = params.competitionId;
      }
      if (params.challengeMetric) {
        this.challengeUnity = params.challengeMetric;
      }
    });
    const detailCompet = {
      competitionType: this.type,
      competitionName: this.categoryName,
      competitionId: this.categoryId,
      challengeStatus: this.challengeStatus,
      challengeMetric: this.challengeUnity,
    };
    localStorage.setItem('detailCompet', JSON.stringify(detailCompet));
    // this.type='Challenge';
    // this.type='Championnat';
    // this.type='Séance Libre';
    this.titleCurrentPage = this.type;
    const item = localStorage.getItem('activite');
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
      const value = JSON.parse(localStorage.getItem('activite'));
      if (value) {
        this.activite = value;
        this.isActif = true;
      }
    });
    return await modal.present();
  }

  async reglage(mySlider) {
    this.titleCurrentPage = 'Réglages';
    mySlider.slideTo(0);
    /*const modal = await this.modalCtrl.create({
      component: ReglagesPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => { });
    return await modal.present();*/
  }

  information() {
    this.router.navigate(['session-now/help']);
  }

  async addContenu() {
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
  /*
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
      this.slides.slideTo(1);
    }
    // this.modalCtr.dismiss(this.base64Image);
  }*/
  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.base64 = 'data:image/jpeg;base64,' + imageData;
        if (this.base64) {
          this.addContenu();
          this.slides.slideTo(1);
        }
      },
      (err) => {
        // Handle error
      }
    );
  }
  start() {
    if (this.isActif) {
      const choice = JSON.parse(localStorage.getItem('reglages'));
      if (!choice) {
        this.router.navigate(['/session-now/demarrage']);
      } else {
        if (choice.compteRebour === true) {
          this.router.navigate(['/session-now/counter']);
        } else {
          this.router.navigate(['/session-now/demarrage']);
        }
      }
    }
  }
  swipePrev() {
    this.slides.getActiveIndex().then((index: number) => {
      if (index === 0) this.titleCurrentPage = 'Réglages';
      if (index === 1) this.titleCurrentPage = this.type;

      if (index !== 2) {
        this.slides.slideNext();
      } else {
        this.slides.slideTo(0);
      }
    });
  }
  slideChange() {
    this.slides.getActiveIndex().then((index: number) => {
      if (index === 0) this.titleCurrentPage = 'Réglages';
      if (index === 1) this.titleCurrentPage = '';
      if (index === 2) {
        this.slides.slideTo(1);
        this.openCamera();
      }
    });
  }
  swipeNext() {
    this.slides.getActiveIndex().then((index: number) => {
      if (index !== 2) {
        this.slides.slideNext();
      } else {
        this.slides.slideTo(0);
      }
    });
  }
  retour() {
    this.navCtl.navigateBack('tabs/tab1');
  }
}
