import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonInput,
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { from, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
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
export class FeedsComponent implements OnInit, OnDestroy {
  feed$: Observable<any>;
  feed: any[] = [];
  lastVisible: any;
  @Input() user: any;
  @Input() championnat: any;
  subscription: Subscription;
  subscription2: Subscription;
  reaction: any;
  picture: any;
  pictureUrl: string;
  text: string;

  @ViewChild('inputFeed') inputFeed: IonInput;

  constructor(
    public feedService: MusicFeedService,
    public http: HttpClient,
    public navCtl: NavController,
    public popoverController: PopoverController,
    public mService: MusicFeedService,
    public modalController: ModalController,
    public ref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    console.log(this.user);
    this.feed$ = from(this.mService.feedQuery(this.championnat.uid));
    this.subscription = this.feed$.subscribe((f) => {
      this.lastVisible = f.last;
      f.table.forEach((fee) => {
        this.feed.push(fee);
        console.log(this.feed);
      });
    });
  }

  async doRefresh(event) {
    console.log(event);
    const feedRefresh = await this.mService.feedQuery(this.championnat.uid);
    setTimeout(() => {
      event.target.complete();
      this.feed = feedRefresh.table;
    }, 2000);
  }

  async presentPopover(i: number, feedLik) {
    const modal = await this.modalController.create({
      component: EmojisComponent,
      cssClass: 'modalEmojis',
    });
    modal.onDidDismiss().then((data) => {
      this.reaction = data.data;
      const react: Reaction[] = feedLik.reactions;
      let isEmojiIsToUser = -1;

      //l'émoji existe déjà
      const isEmojiExist = react.findIndex((f) => f.nom == this.reaction.nom);

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
    });
    return await modal.present();
  }

  async loadData(event) {
    const taille = await this.mService.getFeed();
    const feedPlus = from(
      this.mService.addQuery(this.lastVisible, this.championnat.uid)
    );
    setTimeout(() => {
      event.target.complete();
      this.subscription2 = feedPlus.subscribe((f: any) => {
        f.forEach((fed) => this.feed.push(fed));
      });
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (taille.length <= this.feed.length) {
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

  deletePhoto() {
    this.picture = null;
  }

  async savePhoto(photo) {
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
              userUid: this.user.uid,
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
      this.feedReinit();
    }
  }

  async feedReinit() {
    const feedRefresh = await this.mService.feedQuery(this.championnat.uid);
    this.feed = feedRefresh.table;
    this.inputFeed.value = null;
    this.picture = null;
    this.pictureUrl = null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }
}
