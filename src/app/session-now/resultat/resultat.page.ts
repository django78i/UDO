import { Component, OnInit } from '@angular/core';
import { AddContenuComponent } from '../add-contenu/add-contenu.component';
import { ModalController, Platform } from '@ionic/angular';
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
    { img: 'assets/images/personn.png', nombre: '70', name: 'Bernard', comment: 'Lorem ipsum dolor sit atmet', date: 'Il y a 1 min.', icon: 'assets/images/Blush.png' },
    { img: 'assets/images/personn2.PNG', nombre: '10', name: 'Mélanie', comment: 'Lorem ipsum dolor sit atmet', date: 'Il y a 1 min.', icon: 'assets/images/ThumbsUp.png' },
  ];
  user;
  constructor(private modalCtrl: ModalController,
    private platform: Platform,
    private _location: Location,private storage: AngularFireStorage,
    private sessionNowService:SessionNowService) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this._location.back();
    });
    if (localStorage.getItem('picture')) {
      this.base64Image = localStorage.getItem('picture');
    }
    this.counter = JSON.parse(localStorage.getItem('counter'));
    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.isPicture = localStorage.getItem('addPicture');
  }

  ngOnInit() {
    this.listNotif=[];
    this.activite = JSON.parse(localStorage.getItem('activite'));
    this.listElement = JSON.parse(localStorage.getItem('choix'));

    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    if (this.sessionNow) {
      this.sessionNow.reactionNumber = this.listNotif?.length;
      //if (this.isPicture)
      // this.sessionNow.photo=this.
      // this.activite = item;
      if (this.sessionNow) {
        let list = this.sessionNow.reactions;
        let currentSeconds,currentMinutes,currentHeures;
        currentSeconds = moment().diff(this.sessionNow.startDate, 'seconds');
        currentMinutes = moment().diff(this.sessionNow.startDate, 'minutes');
        currentHeures = moment().diff(this.sessionNow.startDate, 'hours');
        if(currentSeconds>60){
          if(currentMinutes>60){
            this.dateSession = 'il ya ' + currentHeures + ' heures';
          }else{
            this.dateSession = 'il ya ' + currentMinutes + ' minutes';
          }
        }else{
          this.dateSession = 'il ya ' + currentSeconds + ' secondes';
        }

        if(list && list?.length !== 0){
          for (let val of list) {
            let currentValue;
            let date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'minutes');
            if (date > 60) {
              date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'hours');
              if (date > 60) {
                date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'days');
                currentValue = 'il ya ' + date + ' jours';
              } else {
                currentValue = 'il ya ' + date + ' heures';
              }
            } else {
              if (date < 60) {
                currentValue = 'il ya ' + date + ' secondes';
              }
              else {
                currentValue = 'il ya ' + date + ' minutes';
              }
            }
            let value = {
              icon: 'assets/images/' + val.mapValue.fields.reactionType.stringValue,
              commentaire: val.mapValue.fields.commentaire.stringValue,
              username: val.mapValue.fields.username.stringValue,
              img: 'assets/images/personn.png',
              date: currentValue
            };
            this.listReactions.push(value);

          }}

      }
    }
  }

  publier() {
    // if (this.isPicture) {
      if(this.isPicture == 'true'){
        this.donneesPrive();
      }
      else if(localStorage.getItem('picture')){
        this.upload();
      }
    // } else {
    //   this.addContenu();
    // }
  }
  upload(): void {
    var currentDate = new Date().getTime();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `images/${currentDate}`;
    const fileRef = this.storage.ref(filePath);
    this.sessionNowService.presentLoading();
    const task = this.storage.upload(`images/${currentDate}`, file);
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            let image = {
              picture: this.base64Image,
              path: filePath
            }
            localStorage.setItem('image', JSON.stringify(image));
            if (!this.sessionNow) {
              // this.sessionNowService.dissmissLoading();
              // this.sessionNowService.show('Image chargée avec succès', 'success');
            } else {
              let postModel = {
                postedAt: moment().format('DD/MM/YYYY'),
                postedBy: this.user ? this.user.userName : '',
                sessionUUID: this.sessionNow.uid,
                picture: this.base64Image,
                type: 'picture',
                comment:localStorage.getItem('comment')
              }
              this.sessionNowService.create(postModel, 'post-session-now')
                .then(resPicture => {
                  // this.sessionNowService.dissmissLoading();
                  // this.sessionNowService.show('Image créée avec succès', 'success');
                })
            }
          }
        }, error => {
          this.sessionNowService.show('Erreur sur le serveur veuillez réssayé', 'error');
          this.sessionNowService.dissmissLoading();
        });
      })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
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
    });
    return await modal.present();

  }
  async donneesPrive() {
    localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
    const modal = await this.modalCtrl.create({
      component: DonneesPriveComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {

    });
    return await modal.present();

  }


}
