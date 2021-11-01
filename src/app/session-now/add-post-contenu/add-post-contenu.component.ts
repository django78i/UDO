import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {ModalController, Platform} from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SessionNowService } from '../../services/session-now-service.service';
import moment from 'moment';
import { Keyboard }  from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-add-post-contenu',
  templateUrl: './add-post-contenu.component.html',
  styleUrls: ['./add-post-contenu.component.scss'],
})
export class AddPostContenuComponent implements OnInit {
  isPicture = true;
  base64Image: any;
  selectedFile: File = null;
  downloadURL: Observable<string>;
  sessionNow: any;
  postModel: PostModel;
  user;
  activite;
  comment = "";
  isVisible=false;
  constructor(private platform: Platform, private modalCtr: ModalController,
              private keyboard: Keyboard,
    private storage: AngularFireStorage,
    private sessionNowService: SessionNowService) {
    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.base64Image = localStorage.getItem('picture');
    this.activite = JSON.parse(localStorage.getItem('activite'));
    this.platform.keyboardDidShow.subscribe(ev => {
      const { keyboardHeight } = ev;
      this.isVisible=true;
      // Do something with the keyboard height such as translating an input above the keyboard.
    });

    this.platform.keyboardDidHide.subscribe(() => {
      // Move input back to original location
      this.isVisible=false;
    });
  }

  ngOnInit() { }

  async close() {
    const closeModal = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }
  publier() {
    if (this.sessionNow) {
      this.upload();
      localStorage.setItem('addPicture',""+true);

    } else {
      localStorage.setItem('comment',this.comment);
      localStorage.setItem('addPicture',""+false);
      this.sessionNowService.show('Image chargée avec succès', 'success');
    }
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
              this.close();
              this.sessionNowService.dissmissLoading();
              this.sessionNowService.show('Image chargée avec succès', 'success');
            } else {
              let postModel: PostModel = {
                postedAt: moment().format('DD/MM/YYYY'),
                postedBy: this.user ? this.user.userName : '',
                sessionUUID: this.sessionNow.uid,
                picture: this.base64Image,
                type: 'picture',
              }
              postModel['comment']=this.comment;
              this.sessionNowService.create(postModel, 'post-session-now')
                .then(resPicture => {
                  this.close();
                  this.sessionNowService.dissmissLoading();
                  this.sessionNowService.show('Image créée avec succès', 'success');
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
}
export class PostModel {
  postedAt: string;
  postedBy: string;
  sessionUUID: string;
  picture: string;
  type: string;
}
