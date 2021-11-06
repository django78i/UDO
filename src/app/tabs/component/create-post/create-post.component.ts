import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MusicFeedService } from 'src/app/services/music-feed.service';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonInput, ModalController } from '@ionic/angular';
import { AddContenuComponent } from 'src/app/session-now/add-contenu/add-contenu.component';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  @Input() user: any;
  picture: any;
  pictureUrl: any;
  text: string;
  base64: any;
  @ViewChild('InputArea') InputArea: IonInput;
  isVisible = false;
  constructor(
    public feedService: MusicFeedService,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {
    console.log(this.user);
  }

  inputRead(event) {
    console.log(event.detail.value);
    this.text = event.detail.value;
  }

  async send() {
    if (this.base64) {
      const tof = this.savePhoto(this.base64);
      tof.then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            this.pictureUrl = downloadURL;
            console.log(this.pictureUrl);
            const post = {
              userId: this.user.uid,
              userName: this.user.userName,
              userAvatar: this.user.avatar,
              type: 'picture',
              startDate: new Date(),
              reactions: [],
              photo: this.pictureUrl ? this.pictureUrl : '',
              mode: 'public',
              isLive: false,
              comment: this.text,
              // nombre: 0,
              activity: '',
              championnat: '',
              postCount: 0,
              reactionsNombre: 0,
            };
            this.feedService.sendPost(post);
            this.close('envoyer');
          });
        },
        (error) => {
          // Handle unsuccessful uploads
        }
      );
    } else {
      const post = {
        userUid: this.user.uid,
        username: this.user.userName,
        userAvatar: this.user.avatar,
        type: 'post',
        startDate: new Date(),
        reactions: [],
        photo: '',
        mode: 'public',
        isLive: false,
        text: this.text,
        activity: '',
        championnat: '',
        postCount: 0,
      };
      await this.feedService.sendPost(post);
      this.text = '';
    }
  }

  async savePhoto(photo) {
    console.log(photo);
    const storage = getStorage();
    const storageRef = ref(storage, `images/${new Date()}`);
    const uploadTask = uploadString(storageRef, photo, 'data_url');
    return await uploadTask;
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.base64 = theActualPicture;
  }

  async addContenu() {
    console.log('addContenu');
    const modal = await this.modalCtrl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
      this.base64 = data.data != 'Modal Closed' ? data.data : null;
    });
    return await modal.present();
  }

  active(ev) {
    this.isVisible = true;
  }

  blur(ev) {
    this.isVisible = false;
  }

  close(ev?) {
    this.modalCtrl.dismiss(ev ? ev : []);
  }
}
