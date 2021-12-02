import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonInput,
  IonTextarea,
  ModalController,
  NavParams,
  Platform,
} from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SessionNowService } from '../../services/session-now-service.service';
import moment from 'moment';
import { ref } from '@firebase/storage';
import { getDownloadURL, getStorage, uploadString } from 'firebase/storage';

@Component({
  selector: 'app-add-post-contenu',
  templateUrl: './add-post-contenu.component.html',
  styleUrls: ['./add-post-contenu.component.scss'],
})
export class AddPostContenuComponent implements OnInit, OnDestroy {
  isPicture = true;
  base64Image: any;
  selectedFile: File = null;
  downloadURL: Observable<string>;
  sessionNow: any;
  postModel: PostModel;
  user;
  activite;
  comment = '';
  isVisible = false;
  @Input() picture: any;
  @Input() activity: any;

  @ViewChild('textAreaZone') textAreaZone: IonInput;
  small = false;
  mode = '';
  modeClasse = '';
  message = '';
  sub: Subscription;
  constructor(
    private platform: Platform,
    private modalCtr: ModalController,
    private sessionNowService: SessionNowService,
    public ref: ChangeDetectorRef,
    private navParams: NavParams
  ) {
    setInterval(() => {
      if (localStorage.getItem('mode')) {
        if (localStorage.getItem('mode') === 'landscape') {
          this.mode = 'landscape';
          this.modeClasse = 'c-ion-fab-lands';
          this.message = 'message-lands';
        } else {
          this.mode = '';
          this.modeClasse = 'c-ion-fab';
          this.message = 'message';
        }
      } else {
        this.mode = '';
        this.modeClasse = 'c-ion-fab';
        this.message = 'message';
      }
    }, 100);
    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    this.user = JSON.parse(localStorage.getItem('user'));
    //this.base64Image = localStorage.getItem('picture');
    this.activite = JSON.parse(localStorage.getItem('activite'));
    this.picture = this.navParams.get('picture');
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

  ngOnInit() {
    console.log(5);
    //console.log(this.picture);
  }

  async close() {
    const closeModal = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }
  publier() {
    // if (this.sessionNow) {
    this.upload();
    this.sessionNowService.presentLoading();
    //   localStorage.setItem('addPicture', '' + true);
    // } else {
    //   localStorage.setItem('comment', this.comment);
    //   localStorage.setItem('addPicture', '' + false);
    //   this.sessionNowService.show('Image chargée avec succès', 'success');
    // }
  }

  async upload() {
    // const storage = getStorage();
    // const storageRef = ref(storage, `images/${new Date()}`);
    // const uploadTask = uploadString(storageRef, this.picture, 'data_url');
    // uploadTask.then((snapshot) => {
    //   getDownloadURL(snapshot.ref).then((downloadURL) => {
    let url;
    if (this.picture) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${new Date()}`);
      const uploadTask = await uploadString(
        storageRef,
        this.picture,
        'data_url'
      );
      url = await getDownloadURL(uploadTask.ref);
    }
    const detailCompet = JSON.parse(localStorage.getItem('detailCompet'));

    let postModel: PostModel;
    console.log('no sesionNow');
    postModel = {
      startDate: new Date(),
      userName: this.user ? this.user.userName : '',
      userId: this.user ? this.user.uid : '',
      sessionId: this.sessionNow ? this.sessionNow.uid : '',
      photo: url ? url : '',
      type: 'picture',
      reactions: [],
      activity: this.activity,
      isLive: this.sessionNow ? true : false,
      mode: this.sessionNow ? this.sessionNow.mode : 'public',
      userAvatar: this.user.avatar,
      niveau: this.user.niveau,
      comment: this.comment,
      postCount: 0,
      reactionsNombre: 0,
      challengeMetric: detailCompet.challengeMetric,
      championnatType: detailCompet.championnatType,
      competitionId: detailCompet.competitionId,
      competitionName: detailCompet.competitionName,
      competitionType: detailCompet.competitionType,
      // competitionInfo: detailCompet,
      championnat:
        detailCompet.competitionType == 'Championnat'
          ? detailCompet.competitionId
          : '',
      challenge:
        detailCompet.competitionType == 'Challenge'
          ? detailCompet.competitionId
          : '',
    };
    console.log(JSON.stringify(postModel));
    this.sessionNowService
      .create(postModel, 'post-session-now')
      .then((resPicture) => {
        this.close();
        this.sessionNowService.dissmissLoading();
        this.sessionNowService.show('Image créée avec succès', 'success');
      })
      .catch((err) =>
        this.sessionNowService.show(
          "Une erreur s'est produite, veuillez rééssayer plus tard",
          'warning'
        )
      );
  }

  blur(ev) {
    this.isVisible = false;
  }

  active(ev) {
    this.isVisible = true;
  }

  changeInput(event) {
    this.comment = event.detail.value;
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
export class PostModel {
  startDate: Date;
  userName: string;
  userId: string;
  sessionId: string;
  photo: string;
  activity: any;
  type: string;
  isLive: boolean;
  mode: string;
  userAvatar: string;
  niveau: number;
  reactions: any;
  comment: string;
  postCount: number;
  reactionsNombre: number;
  championnat?: string;
  // competitionInfo?: any;
  challenge?: string;
  challengeMetric?: string;
  championnatType?: string;
  competitionId?: string;
  competitionName?: string;
  competitionType?: string;
}
