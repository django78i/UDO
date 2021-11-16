import { Component, OnInit } from '@angular/core';
import { AddContenuComponent } from '../add-contenu/add-contenu.component';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DonneesPriveComponent } from '../donnees-prive/donnees-prive.component';
import { Location } from '@angular/common';
import { SessionNowModel } from '../demarrage/demarrage.page';
import moment from 'moment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SessionNowService } from '../../services/session-now-service.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';

@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.page.html',
  styleUrls: ['./resultat.page.scss'],
})
export class ResultatPage implements OnInit {
  sessionNow: SessionNowModel;
  selectedFile: File = null;
  downloadURL: Observable<string>;
  activite: any;
  listElement: any;
  now;
  isPicture;
  commentaire = '';
  base64Image: any;
  counter: any;
  listReactions = [];
  dateSession: any;
  listNotif: any = [
    {
      img: 'assets/images/personn.png',
      nombre: '70',
      name: 'Bernard',
      comment: 'Lorem ipsum dolor sit atmet',
      date: 'Il y a 1 min.',
      icon: 'assets/images/Blush.png',
    },
    {
      img: 'assets/images/personn2.PNG',
      nombre: '10',
      name: 'Mélanie',
      comment: 'Lorem ipsum dolor sit atmet',
      date: 'Il y a 1 min.',
      icon: 'assets/images/ThumbsUp.png',
    },
  ];
  user;
  isVisible = false;
  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private _location: Location,
    private storage: AngularFireStorage,
    private sessionNowService: SessionNowService,
    public navCtl: NavController,
    public router: Router
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this._location.back();
    });
    this.counter = JSON.parse(localStorage.getItem('counter'));
    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.isPicture = localStorage.getItem('addPicture');
  }

  ngOnInit() {
    this.listNotif = [];
    this.activite = JSON.parse(localStorage.getItem('activite'));
    this.listElement = JSON.parse(localStorage.getItem('choix'));

    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    if (this.sessionNow) {
      this.sessionNow.reactionNumber = this.listNotif?.length;
      if (this.sessionNow) {
        let list = this.sessionNow.reactions;
        let currentSeconds, currentMinutes, currentHeures;
        currentSeconds = moment().diff(this.sessionNow.startDate, 'seconds');
        currentMinutes = moment().diff(this.sessionNow.startDate, 'minutes');
        currentHeures = moment().diff(this.sessionNow.startDate, 'hours');
        if (currentSeconds > 60) {
          if (currentMinutes > 60) {
            this.dateSession = 'il ya ' + currentHeures + ' heures';
          } else {
            this.dateSession = 'il ya ' + currentMinutes + ' minutes';
          }
        } else {
          this.dateSession = 'il ya ' + currentSeconds + ' secondes';
        }

        if (list && list?.length !== 0) {
          for (let val of list) {
            let currentValue;
            let date = moment(val.mapValue.fields.date.stringValue).diff(
              moment(),
              'minutes'
            );
            if (date > 60) {
              date = moment(val.mapValue.fields.date.stringValue).diff(
                moment(),
                'hours'
              );
              if (date > 60) {
                date = moment(val.mapValue.fields.date.stringValue).diff(
                  moment(),
                  'days'
                );
                currentValue = 'il ya ' + date + ' jours';
              } else {
                currentValue = 'il ya ' + date + ' heures';
              }
            } else {
              if (date < 60) {
                currentValue = 'il ya ' + date + ' secondes';
              } else {
                currentValue = 'il ya ' + date + ' minutes';
              }
            }
            let value = {
              icon:
                'assets/images/' + val.mapValue.fields.reactionType.stringValue,
              commentaire: val.mapValue.fields.commentaire.stringValue,
              username: val.mapValue.fields.username.stringValue,
              img: 'assets/images/personn.png',
              date: currentValue,
            };
            this.listReactions.push(value);
          }
        }
      }
    }
  }

  blur(ev) {
    this.isVisible = false;
  }

  active(ev) {
    this.isVisible = true;
  }

  publier() {
    this.upload();
    this.sessionNowService.presentLoading();
  }

  async upload() {
    console.log(this.sessionNow);
    let url;
    if (this.base64Image) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${new Date()}`);
      const uploadTask = await uploadString(
        storageRef,
        this.base64Image,
        'data_url'
      );
      url = await getDownloadURL(uploadTask.ref);
    }
    let postModel: PostModel = {
      startDate: new Date(),
      userName: this.user ? this.user.userName : '',
      userId: this.user ? this.user.uid : '',
      sessionId: this.sessionNow.uid,
      photo: url ? url : '',
      type: 'picture',
      reactions: this.sessionNow.reactions,
      reactionsNombre: this.sessionNow.reactionsNombre,
      activity: this.sessionNow.activity,
      isLive: false,
      mode: this.sessionNow.mode,
      userAvatar: this.user.avatar,
      niveau: this.user.niveau,
      metrics: this.sessionNow.metrics,
      uid: this.sessionNow.uid,
      comment: this.sessionNow.comment ? this.sessionNow.comment : '',
      duree: this.counter,
    };
    console.log(postModel);
    this.sessionNowService.findPostLies(this.sessionNow.sessionId);
    this.sessionNowService
      .update(postModel, 'post-session-now')
      .then((resPicture) => {
        this.navCtl.navigateForward('');
        localStorage.removeItem('sessionNow')
        this.sessionNowService.dissmissLoading();
        this.sessionNowService.show('Seance publiée avec succés', 'success');
      });
  }

  changeInput(event) {
    this.sessionNow.comment = event.detail.value;
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    localStorage.setItem('picture', theActualPicture);
    this.addContenu();
    // this.modalCtr.dismiss(this.base64Image);
  }
  async addContenu() {
    const modal = await this.modalCtrl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
      console.log(data.data);
      this.base64Image = data.data != 'Modal Closed' ? data.data : null;
    });
    return await modal.present();
  }
  async donneesPrive() {
    localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
    const modal = await this.modalCtrl.create({
      component: DonneesPriveComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }
}

export class PostModel {
  startDate: Date;
  userName: string;
  userId: string;
  sessionId: string;
  photo: string;
  activity: string;
  type: string;
  isLive: boolean;
  mode: string;
  userAvatar: string;
  niveau: number;
  reactions: any;
  reactionsNombre: number;
  metrics: any[];
  uid: string;
  comment: string;
  duree: any;
}
