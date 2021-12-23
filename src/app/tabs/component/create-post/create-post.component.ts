import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MusicFeedService } from 'src/app/services/music-feed.service';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonInput, ModalController, Platform } from '@ionic/angular';
import { AddContenuComponent } from 'src/app/session-now/add-contenu/add-contenu.component';
import { SessionNowService } from 'src/app/services/session-now-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit, OnDestroy {
  @Input() user: any;
  picture: any;
  pictureUrl: any;
  text: string = '';
  base64: any;
  @ViewChild('InputArea') InputArea: IonInput;
  isVisible = false;
  sub: Subscription;
  constructor(
    public feedService: MusicFeedService,
    public modalCtrl: ModalController,
    public sessionowService: SessionNowService,
    public platform: Platform,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(this.user);
    this.sub = this.platform.keyboardDidShow.subscribe((ev) => {
      const { keyboardHeight } = ev;
      this.isVisible = true;
      this.ref.detectChanges();
      // Do something with the keyboard height such as translating an input above the keyboard.
    });

    this.sub.add(
      this.platform.keyboardDidHide.subscribe(() => {
        // Move input back to original location
        this.isVisible = false;
        this.ref.detectChanges();
      })
    );
  }

  inputRead(event) {
    console.log(event.detail.value);
    this.text = event.detail.value;
    console.log(this.text);
  }

  async send() {
    console.log(this.text, this.picture);
    if (this.base64 || this.text != '') {
      this.sessionowService.presentLoading();
      let url;
      if (this.base64) {
        const tof = await this.savePhoto(this.base64);
        url = await getDownloadURL(tof.ref);
      }
      const post = {
        userId: this.user.uid,
        userName: this.user.userName,
        userAvatar: this.user.avatar,
        type: 'picture',
        startDate: new Date(),
        reactions: [],
        photo: url ? url : '',
        mode: 'public',
        isLive: false,
        comment: this.text,
        activity: '',
        championnat: '',
        postCount: 0,
        reactionsNombre: 0,
      };

      await this.feedService.sendPost(post);
      this.text = '';
      this.sessionowService.dissmissLoading();
      this.sessionowService.show('Post publies', 'success');
      await this.feedService.feedFilter('Récent');

      this.modalCtrl.dismiss();
    }
  }

  async savePhoto(photo) {
    console.log(photo);
    const storage = getStorage();
    const storageRef = ref(storage, `images/${new Date()}`);
    const uploadTask = uploadString(storageRef, photo, 'data_url');
    return await uploadTask;
  }

  async addContenu() {
    console.log('addContenu');
    const modal = await this.modalCtrl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
