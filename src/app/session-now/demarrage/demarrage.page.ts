import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonSlides,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { ListMetricsPage } from '../list-metrics/list-metrics.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { ReglagesPage } from '../reglages/reglages.page';
import { Router } from '@angular/router';
import { Health } from '@ionic-native/health/ngx';
import { Platform } from '@ionic/angular';
import { DonneesPriveComponent } from '../donnees-prive/donnees-prive.component';
import { SessionNowService } from '../../services/session-now-service.service';
import { AddPostContenuComponent } from '../add-post-contenu/add-post-contenu.component';
import { ShowNotificationPage } from '../show-notification/show-notification.page';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-demarrage',
  templateUrl: './demarrage.page.html',
  styleUrls: ['./demarrage.page.scss'],
})
export class DemarragePage implements OnInit {
  @ViewChild('mySlider') slides: IonSlides;
  slideOptsOne = {
    initialSlide: 1,
    slidesPerView: 1,
    autoplay: false,
  };
  titleCurrentPage: string;
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
      img: 'assets/images/distance_m.svg',
      nombre: '0',
      name: 'Distance',
      exposant: 'KM',
      fieldname: 'distance',
    },
    {
      img: 'assets/images/pas.svg',
      nombre: '0',
      name: 'Nombre de pas',
      exposant: '',
      fieldname: 'steps',
    },
    {
      img: 'assets/images/heart_m.svg',
      nombre: '0',
      name: 'BPM',
      exposant: '',
      fieldname: 'heart_rate',
    },
    {
      img: 'assets/images/calories_m.svg',
      nombre: '0',
      name: 'Calories',
      exposant: 'CAL',
      fieldname: 'calories',
    },
  ];
  sessionNow = new SessionNowModel();
  listSettings = [];
  user: any;
  reactions = 0;
  interval;
  mode = '';
  modeClasse = '';
  demarrage = '';
  constructor(
    private backgroundMode: BackgroundMode,
    private modalCtrl: ModalController,
    private router: Router,
    private toastCtrl: ToastController,
    public navController: NavController,
    private health: Health,
    private platform: Platform,
    private snService: SessionNowService,
    public alertController: AlertController,
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
    this.image = JSON.parse(localStorage.getItem('image'));
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.presentAlertConfirm();
    });
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getSessionNow();
  }

  /**
   * cette fonction permet de recuperer la seance now en cours
   */
  async getSessionNow() {
    this.interval = setInterval(() => {
      const sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
      if (sessionNow) {
        this.snService.find(sessionNow.uid, 'session-now').then((resp: any) => {
          const value = resp._document.data.value.mapValue.fields;
          if (value.reactions.arrayValue.values) {
            this.reactions = value.reactions.arrayValue.values?.length;
            this.sessionNow.reactions = value.reactions.arrayValue.values;
            if (
              this.sessionNow.reactions.length !==
                sessionNow.reactions.length &&
              this.reactions !== 0
            ) {
              this.showNotification();
            }
            // localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
          } else {
            this.reactions = 0;
            this.sessionNow.reactions = [];
          }

          localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
        });
      }
    }, 10000);
  }

  /**
   * cette alert permet de confirmer la sortie de l'application
   */
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
          },
        },
        {
          text: 'Oui',
          handler: () => {
            // on quitte l'application et on supprime tous les posts
            this.destroySession();
            // this.displayRecap();
          },
        },
      ],
    });

    await alert.present();
  }
  destroySession() {
    this.snService.deleteSessionCascade(this.sessionNow.sessionId);
    //on supprime la session now stocké dans le locl storage
    localStorage.removeItem('sessionNow');
    this.router.navigate(['tabs']);
  }
  ngOnInit() {
    // activate background mode
    //  this.backgroundMode.enable();

    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    /* this.backgroundMode.isScreenOff( function(bool) {
      this.updateChrono();
      this.backgroundMode.wakeUp();
      this.backgroundMode.unlock();
    });*/
    const stSettings = localStorage.getItem('reglages');
    if (stSettings) {
      this.listSettings = JSON.parse(stSettings);
    }
    const valPause = localStorage.getItem('pause');
    if (valPause) {
      this.pause = true;
    }
    this.start();
    this.checkPlatformReady();

    this.listElement = [
      {
        img: 'assets/images/distance_m.svg',
        nombre: '0',
        name: 'Distance',
        exposant: 'KM',
        fieldname: 'distance',
      },
      {
        img: 'assets/images/pas.svg',
        nombre: '0',
        name: 'Nombre de pas',
        exposant: '',
        fieldname: 'steps',
      },
      {
        img: 'assets/images/heart_m.svg',
        nombre: '0',
        name: 'BPM',
        exposant: '',
        fieldname: 'heart_rate',
      },
      {
        img: 'assets/images/calories_m.svg',
        nombre: '0',
        name: 'Calories',
        exposant: 'CAL',
        fieldname: 'calories',
      },
    ];
    const item = JSON.parse(localStorage.getItem('activite'));
    if (item) {
      this.activite = item;
    }
    const choix = localStorage.getItem('choix');
    if (!choix) {
      localStorage.setItem('choix', JSON.stringify(this.listChoix));
    } else {
      this.listElement = JSON.parse(localStorage.getItem('choix'));
    }
    this.sessionNow.startDate = new Date();
    this.sessionNow.activity = this.activite;
    if (
      this.listSettings !== null &&
      this.listSettings !== undefined &&
      this.listSettings.length !== 0
    ) {
      if (!this.listSettings['modePrive']) {
        this.sessionNow.mode = 'privée';
      } else {
        this.sessionNow.mode = 'public';
      }
    } else {
      this.sessionNow.mode = 'public';
    }
    this.sessionNow.isLive = true;
    // this.sessionNow.uid = "ef8f7e570c5f3be4f726ce612224a350";
    this.snService
      .createSessionNow(this.sessionNow)
      .then((res) => {
        this.sessionNow.uid = res;
        localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
        this.sessionNow.photo = this.image ? this.image.picture : '';
        this.sessionNow.userName = this.user ? this.user.userName : '';
        this.sessionNow.userId = this.user ? this.user.uid : '';
        this.sessionNow.sessionId = res;
        this.sessionNow.userAvatar = this.user.avatar;
        this.sessionNow.userNiveau = this.user.niveau;
        this.sessionNow.postCount = 0;
        this.sessionNow.reactionsNombre = 0;

        const sessionNow: SessionNowModel = { ...this.sessionNow };
        sessionNow.type = 'session-now';

        this.snService.createPostSessionNow(sessionNow).then((resPost) => {
          console.log('je suis la');
          // this.sessionNow.uid = res;
          localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
        });
      })
      .catch((err) => console.error(err));
    localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
  }

  /**
   * cette fonction permet de verififer si la plateforme est disponible pour le health
   */
  async checkPlatformReady() {
    const ready = !!(await this.platform.ready());
    if (ready) {
      // Use plugin functions here
      this.health
        .requestAuthorization([
          'distance',
          'nutrition',
          'activity', //read and write permissions
          {
            read: ['steps', 'height', 'weight', 'heart_rate', 'calories'], //read only permission
            write: ['height', 'weight'], //write only permission
          },
        ])
        .then((res) => this.getMetrics())
        .catch((e) => console.log('error1 ' + e));
    }
  }

  /**
   * cette fonction permet de parcourir et recuperer les metric a afficher sur la page
   */
  getMetrics() {
    if (this.status === 'play') {
      for (const item of this.listElement) {
        this.queryMetrics(item.fieldname, item);
      }
      const that = this;
      // this.getMetrics();
      // @ts-ignore
      setTimeout(() => {
        that.getMetrics();
      }, 1000);
    }
  }

  /**
   * ce callback est appelé pour procéder le resultat obtenu apres la recuperation de la metric de p
   *
   * @param res
   * @param item
   */
  processMetricResult(res, item) {
    if (item.fieldname === 'speed') {
      const distance = res.length > 0 ? res[res.length - 1]?.value : 0;
      if (distance !== 0) {
        const speed = this.calculSpeed(distance, this.mn * 60 + this.s);
        item.nombre =
          Math.round((parseFloat(speed.km.toString()) + Number.EPSILON) * 100) /
          100;
      }
    } else {
      item.nombre =
        res.length > 0
          ? Math.round(
              (parseFloat(res[res.length - 1]?.value) + Number.EPSILON) * 100
            ) / 100
          : '0';
    }
    if (item.fieldname === 'distance') {
      if (
        item.nombre !== 0 &&
        item.nombre !== undefined &&
        item.nombre !== ''
      ) {
        item.nombre = Math.round(item.nombre / 100) / 10;
      }
    }
    console.log('res', res);
  }

  /**
   * cette fonction permet d'afficher les metrics
   *
   * @param metric
   * @param item
   */
  // @ts-ignore
  queryMetrics(metric, item) {
    const option: any = {
      startDate: new Date(this.sessionNow.startDate), // three days ago
      endDate: new Date(), // now
      dataType: metric,
    };
    console.log(new Date(this.sessionNow.startDate));
    if (metric === 'steps' || metric === 'distance' || metric === 'speed') {
      if (metric === 'speed') {
        option.dataType = 'distance';
      }
      option.bucket = 'hour';
      this.health
        .queryAggregated(option)
        .then((res) => this.processMetricResult(res, item))
        .catch((e) => console.log('error3 ', e));
    } else {
      option.limit = 100;
      this.health
        .query(option)
        .then((res) => this.processMetricResult(res, item))
        .catch((e) => console.log('error1 ', e));
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

  /**
   * cette fonction permet d'afficher la page de recapitulatif
   */
  displayRecap() {
    this.stop();
    const listMetricAuhorised = [
      'steps',
      'distance',
      'calories',
      'activity',
      'height',
      'weight',
    ];
    this.sessionNow.isLive = false;
    this.sessionNow.duration = this.mn + ':' + this.s;
    for (const metric of this.listElement) {
      for (const metricAutorised of listMetricAuhorised) {
        if (metric.fieldname === metricAutorised) {
          this.sessionNow.metrics.push(metric);
        }
      }
    }

    this.sessionNow.endDate =
      new Date().toISOString().split('T')[0] +
      ' ' +
      new Date().toISOString().split('T')[1].split('.')[0];
    localStorage.setItem('counter', JSON.stringify({ mn: this.mn, s: this.s }));
    localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
    // redirection vers le composant qui affiche le recapitulatif
    this.router.navigate(['session-now/resultat']);
  }

  /**
   * cette fonction permet d'ouvrir la camera
   */
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
  /* async openCamera() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
    });
console.log(1);
    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    console.log(2);
    this.base64=theActualPicture;
    if (this.base64) {
      console.log(3);
      this.addContenu();
    }
  }*/
  /**
   * cette fonction permet d'afficher un toast message
   *
   * @param message
   * @param type
   */
  async showMessage(message, type) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: type,
      position: 'bottom',
    });
    toast.present();
  }

  /**
   * cette methode permet de naviguer vers le comosant aide
   */
  information() {
    this.router.navigate(['session-now/help']);
  }

  /**
   * cette fonction permet d'afficher une nouvelles notifications
   */
  async showNotification() {
    const modal = await this.modalCtrl.create({
      component: ShowNotificationPage,
      cssClass: 'my-custom-show-notification-modal',
      componentProps: {
        data: {
          data: this.sessionNow.reactions[0],
        },
      },
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }
  /**
   * Cette methode permet d'ouvrir le modal des notification
   */
  async notification() {
    localStorage.setItem('counter', JSON.stringify({ mn: this.mn, s: this.s }));
    const modal = await this.modalCtrl.create({
      component: NotificationsPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  /**
   * Cette methode permet d'ouvrir le modal de selection des photos
   */
  async addContenu() {
    console.log(4);
    const modal = await this.modalCtrl.create({
      component: AddPostContenuComponent,
      cssClass: 'my-custom-contenu-modal',
      componentProps: { picture: this.base64, activity: this.activite },
    });
    // modal.onDidDismiss().then((data: any) => {
    //   this.base64 = data.data;
    // });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  /**
   * Cette methode asynchrone permet d'ouvrir sous forme de modal le composant reglage
   */
  async reglage() {
    localStorage.setItem('counter', JSON.stringify({ mn: this.mn, s: this.s }));
    const modal = await this.modalCtrl.create({
      component: ReglagesPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  /**
   * La fonction update_chrono incrémente le nombre de millisecondes
   * par 1 <==> 1*cadence = 100
   * */
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

  /**
   * cette methode permet de démarrer le chrono
   */
  start() {
    this.status = 'play';
    this.t = setInterval(() => {
      this.updateChrono();
    }, 100);
    // btn_start.disabled=true;
  }
  /**
   * cette methode permet d'arreter  le chrono
   */
  stop() {
    this.status = 'pause';
    clearInterval(this.t);
    //btn_start.disabled=false;
  }

  /**
   * cette methode synchrone permet d'ouvrir sous forme de modal le composant listMetric
   *
   * @param item
   * @param index
   */
  async choix(item, index) {
    const modal = await this.modalCtrl.create({
      component: ListMetricsPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {
        choix: item,
        min: this.mn,
        sec: this.s,
      },
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        let value = data.data;
        for (const el of this.listElement) {
          if (el.name === value.name) {
            this.showMessage(
              'Cette activité est déjà dans la liste',
              'warning'
            );
            return;
          }
        }
        for (const val of this.listChoix) {
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

  /**
   * Cette méthode permet de calculer la vitesse
   *
   * @param distanceMeter
   * @param timeSeconds
   */
  calculSpeed(distanceMeter, timeSeconds) {
    return {
      m: distanceMeter / timeSeconds,
      km: (distanceMeter / timeSeconds) * 3.6,
    };
  }
  slideChange() {
    this.slides.getActiveIndex().then((index: number) => {
      if (index === 0) {
        this.titleCurrentPage = 'Réglages';
      }
      if (index === 1) {
        this.titleCurrentPage = '';
      }
      if (index === 2) {
        this.openCamera();
        this.slides.slideTo(1);
      }
    });
  }
}
export class SessionNowModel {
  uid: string;
  startDate: Date;
  endDate: string;
  activity: string;
  userId: string;
  photo: string;
  userName: string;
  reactionNumber: number;
  reactions = [];
  metrics = [];
  score: number;
  mode: string; // 'private or public'
  championant: string; // nulllable true
  isLive: boolean; // true or false
  duration: string;
  comment: string;
  sessionId: string;
  userAvatar: string;
  userNiveau: number;
  postCount: 0;
  reactionsNombre: 0;
  type: string;
}
export class PostModel {
  postedAt: string;
  postedBy: string;
  sessionId: string;
  picture: string;
  userAvatar: string;
  userNiveau: number;
}
