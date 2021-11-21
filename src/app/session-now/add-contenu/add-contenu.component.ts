import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SessionNowService } from '../../services/session-now-service.service';
import moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-add-contenu',
  templateUrl: './add-contenu.component.html',
  styleUrls: ['./add-contenu.component.scss'],
})
export class AddContenuComponent implements OnInit {
  isPicture = true;
  base64Image: any;
  selectedFile: File = null;
  downloadURL: Observable<string>;
  sessionNow: any;
  postModel: PostModel;
  user;
  constructor(
    private modalCtr: ModalController,
    private storage: AngularFireStorage,
    private sessionNowService: SessionNowService,
    private camera: Camera
  ) {
    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {}

  async close() {
    const closeModal = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

  /* async openCamera() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.base64Image = theActualPicture;
    // localStorage.setItem('picture', this.base64Image);
    // this.upload();
    this.modalCtr.dismiss(this.base64Image);

  } */

  /* async openGallery() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.base64Image = theActualPicture;
    // this.upload();
    this.modalCtr.dismiss(this.base64Image);

  } */

  /**
   * cette fonction permet d'ouvrir la gallery
   */
  openGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        if (this.base64Image) {
          this.modalCtr.dismiss(this.base64Image);
        }
      },
      (err) => {
        // Handle error
      }
    );
  }
  /**
   * cette fonction permet d'ouvrir la camera
   */
  openCamera() {
    console.log('ici');
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
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        if (this.base64Image) {
          this.modalCtr.dismiss(this.base64Image);
        }
      },
      (err) => {
        // Handle error
      }
    );
  }

  upload(): void {
    const currentDate = new Date().getTime();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `images/${currentDate}`;
    const fileRef = this.storage.ref(filePath);
    this.sessionNowService.presentLoading();
    const task = this.storage.upload(`images/${currentDate}`, file);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(
            (downloadURL) => {
              if (downloadURL) {
                const image = {
                  picture: this.base64Image,
                  path: filePath,
                };
                localStorage.setItem('image', JSON.stringify(image));
                if (!this.sessionNow) {
                  this.close();
                  this.sessionNowService.dissmissLoading();
                  this.sessionNowService.show(
                    'Image chargée avec succès',
                    'success'
                  );
                } else {
                  const postModel: PostModel = {
                    startDate: moment().format('DD/MM/YYYY'),
                    userName: this.user ? this.user.userName : '',
                    userId: this.user ? this.user.uid : '',
                    sessionId: this.sessionNow.uid,
                    photo: this.base64Image,
                    activity: this.sessionNow.activity,
                    type: 'picture',
                    isLive: false,
                    reactions: [],
                    mode: this.sessionNow.mode,
                    userAvatar: this.sessionNow.userAvatar,
                    niveau: this.sessionNow.userNiveau,
                  };
                  this.sessionNowService
                    .create(postModel, 'post-session-now')
                    .then((resPicture) => {
                      this.close();
                      this.sessionNowService.dissmissLoading();
                      this.sessionNowService.show(
                        'Image créée avec succès',
                        'success'
                      );
                    });
                }
              }
            },
            (error) => {
              this.sessionNowService.show(
                'Erreur sur le serveur veuillez réssayé',
                'error'
              );
              this.sessionNowService.dissmissLoading();
            }
          );
        })
      )
      .subscribe((url) => {
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
}
export class PostModel {
  startDate: string;
  userName: string;
  userId: string;
  sessionId: string;
  photo: string;
  activity: [];
  type: string;
  isLive: boolean;
  mode: string;
  userAvatar: string;
  niveau: number;
  reactions: [];
}
