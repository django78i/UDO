import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonInput,
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { EmojisComponent } from 'src/app/components/emojis/emojis.component';
import { MusicFeedService } from 'src/app/services/music-feed.service';
import { DetailPostComponent } from '../detail-post/detail-post.component';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BehaviorSubject } from 'rxjs';
import { UserProfilComponent } from 'src/app/components/user-profil/user-profil.component';
import * as _ from 'lodash';

const MEDIA_FILES_KEY = 'mediaFiles';
interface Reaction {
  icon: string;
  nom: string;
  nombre: number;
  users: Users[];
}

interface Users {
  avatar: string;
  date: Date;
  name: string;
  uid: string;
}

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss'],
})
export class FeedsComponent implements OnInit {
  feed: any[] = [];
  lastVisible: any;
  @Input() user: any;
  @Input() championnat: any;
  reaction: any;
  picture: any;
  pictureUrl: string;
  text: string;
  blob: Blob;
  @ViewChild('inputFeed') inputFeed: IonInput;
  @ViewChild('player') videoPlayerInput: any;

  videoInfo: BehaviorSubject<any> = new BehaviorSubject(null);
  videoThumb: any;
  private win: any = window;

  constructor(
    public feedService: MusicFeedService,
    public http: HttpClient,
    public navCtl: NavController,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public ref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    console.log(this.user);
    const feedPrime = await this.feedService.feedQuery(this.championnat.uid);
    this.feed = feedPrime.table;
    // feedPrime.table.forEach((fee) => {
    //   this.feed.push(fee);
    //   console.log(this.feed);
    // });
    this.lastVisible = feedPrime.last;
  }

  async doRefresh(event) {
    this.feed = [];
    console.log(event);
    const feedRefresh = await this.feedService.feedQuery(this.championnat.uid);
    setTimeout(() => {
      event.target.complete();
      this.feed = feedRefresh.table;
      this.lastVisible = feedRefresh.last;
    }, 2000);
  }

  async presentPopover(i: number, feedLik) {
    const modal = await this.modalController.create({
      component: EmojisComponent,
      cssClass: 'modalEmojis',
      showBackdrop:true
    });
    modal.onDidDismiss().then((data) => {
      this.reaction = data.data;
      this.controleReaction(i, feedLik.reactions);
      this.reaction = null;
    });
    return await modal.present();
  }

  controleReaction(i: number, reactions?: any[], reaction?: any) {
    console.log(this.reaction);
    const react: Reaction[] = reactions;
    let isEmojiIsToUser = -1;
    console.log(react);
    //l'émoji existe déjà
    const isEmojiExist = react.findIndex((f) =>
      this.reaction ? f.nom == this.reaction.nom : f.nom == reaction.nom
    );

    //le user a déjà envoyé cet émoji
    if (isEmojiExist != -1) {
      isEmojiIsToUser = react[isEmojiExist].users.findIndex(
        (user) => user.uid == this.user.uid
      );
    }
    let indice;
    let userAlreadyLike = -1;
    react.map((react, index) => {
      //l'utiisateur a déjà un like actif
      const ind = react.users.findIndex((us) => us.uid == this.user.uid);
      if (ind != -1) {
        indice = index;
        userAlreadyLike = ind;
      }
    });
    console.log(isEmojiExist, isEmojiIsToUser, userAlreadyLike);
    if (isEmojiIsToUser != -1) {
      console.log('ici');
      return;
    } else if (isEmojiExist != -1) {
      console.log('parla');

      this.feed[i].reactions[isEmojiExist].nombre += 1;
      this.feed[i].reactions[isEmojiExist].users.push({
        uid: this.user.uid,
        name: this.user.userName,
        date: new Date(),
        avatar: this.user.avatar,
      });
    } else {
      console.log('la');

      this.feed[i].reactions.push({
        ...this.reaction,
        nombre: 1,
        users: [
          {
            uid: this.user.uid,
            name: this.user.userName,
            date: new Date(),
            avatar: this.user.avatar,
          },
        ],
      });
    }
    if (userAlreadyLike != -1) {
      this.feed[i].reactions[indice].nombre -= 1;
      this.feed[i].reactions[indice].users.splice(userAlreadyLike, 1);
    }
    this.feedService.updatePost(this.feed[i]);
  }

  async loadData(event) {
    const taille = await this.feedService.feedQuery(this.championnat.uid);
    const feedPlus = await this.feedService.addQuery(
      this.lastVisible,
      this.championnat.uid,
      'championnat'
    );

    setTimeout(() => {
      event.target.complete();
      this.lastVisible = feedPlus.last;
      feedPlus.table.forEach((fed) => this.feed.push(fed));
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (taille.last <= this.feed.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async openDetail(post) {
    const modal = await this.modalController.create({
      component: DetailPostComponent,
      cssClass: 'testModal',
      componentProps: {
        post,
        user: this.user,
      },
    });
    return await modal.present();
  }
  async addPhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.picture = theActualPicture;
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
    this.picture = theActualPicture;
  }

  deletePhoto() {
    this.picture = null;
  }

  async savePhoto(photo) {
    console.log(photo);
    const storage = getStorage();
    const storageRef = ref(storage, `images/${new Date()}`);
    const uploadTask = uploadString(storageRef, photo, 'data_url');
    return await uploadTask;
  }

  inputRead(event) {
    console.log(event.detail.value);
    this.text = event.detail.value;
  }

  async send() {
    if (this.picture) {
      const tof = this.savePhoto(this.picture);
      tof.then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            this.pictureUrl = downloadURL;
            console.log(this.pictureUrl);
            const post = {
              userId: this.user.uid,
              username: this.user.userName,
              userAvatar: this.user.avatar,
              type: 'post',
              startDate: new Date(),
              reactions: [],
              photo: this.pictureUrl ? this.pictureUrl : '',
              mode: 'public',
              isLive: false,
              text: this.text,
              // nombre: 0,
              activity: '',
              championnat: this.championnat.uid,
            };
            this.feedService.sendPost(post);
            this.feedReinit();
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
        championnat: this.championnat.uid,
      };
      await this.feedService.sendPost(post);
      this.feedReinit();
    }
  }

  async feedReinit() {
    this.feed = [];
    console.log(this.feed);
    const feedRefresh = await this.feedService.feedQuery(this.championnat.uid);
    console.log(feedRefresh);
    feedRefresh.table.forEach((fee) => {
      this.feed.push(fee);
    });
    this.inputFeed.value = null;
    this.picture = null;
    this.pictureUrl = null;
  }

  async openProfil(contact) {
    console.log(contact);
    const modal = await this.modalController.create({
      component: UserProfilComponent,
      componentProps: {
        userId: contact,
        currentUser: this.user,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data == 'encore') {
        this.modalController.dismiss();
      }
    });
    return await modal.present();
  }
}
