import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
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
import { AddContenuComponent } from 'src/app/session-now/add-contenu/add-contenu.component';
import { DetailPostComponent } from '../detail-post/detail-post.component';

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
export class FeedsComponent implements OnInit, OnChanges {
  // feed: any[] = [];
  // lastVisible: any;
  @Input() user: any;
  @Input() championnat: any;
  @Input() lastVisible: any;
  @Input() feed: any;
  @Input() competition: any;

  reaction: any;
  picture: any;
  pictureUrl: string;
  boole: boolean = false;
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
    public ref: ChangeDetectorRef,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    this.competition.toLowerCase();
    console.log('init', this.feed, this.competition);
  }

  async loadData(event) {
    const taille = await this.feedService.feedQuery(
      this.championnat.uid,
      this.competition.toLowerCase()
    );
    const feedPlus = await this.feedService.addFeedChamps(
      this.competition.toLowerCase(),
      this.lastVisible,
      this.championnat.uid
    );
    setTimeout(() => {
      event.target.complete();
      this.lastVisible = feedPlus.last;
      console.log(taille.last);
      feedPlus.table.forEach((fed) => this.feed.push(fed));
      if (taille.last.data() <= this.feed.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async doRefresh(event) {
    this.feed = [];
    console.log(event);
    const feedRefresh = await this.feedService.feedQuery(
      this.championnat.uid,
      this.competition.toLowerCase()
    );
    setTimeout(() => {
      event.target.complete();
      this.feed = feedRefresh.table;
      this.lastVisible = feedRefresh.last;
    }, 2000);
  }

  controleReaction(i: number, reactions?: any[], reaction?: any) {
    console.log(this.reaction);
    const react: Reaction[] = reactions;
    console.log(react);
    //l'émoji existe déjà
    const isEmojiExist = react.findIndex((f) =>
      this.reaction ? f.nom == this.reaction.nom : f.nom == reaction.nom
    );

    if (isEmojiExist != -1) {
      console.log('parla');

      //incrémente de 1 compteur général réactions
      this.feed[i].reactionsNombre += 1;

      //incrémente de 1 compteur de la réaction
      this.feed[i].reactions[isEmojiExist].nombre += 1;

      //Ajout user dans le tableau des users de la réaction
      this.feed[i].reactions[isEmojiExist].users.push({
        uid: this.user.uid,
        name: this.user.userName,
        avatar: this.user.avatar,
        date: new Date(),
      });
    } else {
      //incrémente de 1 compteur général réactions
      this.feed[i].reactionsNombre = this.feed[i].reactionsNombre += 1;
      this.feed[i].reactions.push({
        ...this.reaction,
        nombre: 1,
        users: [
          {
            uid: this.user.uid,
            name: this.user.userName,
            avatar: this.user.avatar,
            date: new Date(),
          },
        ],
      });
    }
    console.log(this.feed[i].reactionsNombre);

    //création object réactions pour le séanceNow
    if (this.feed[i].type == 'session-now') {
      const reactionPost = {
        ...this.reaction,
        user: {
          uid: this.user.uid,
          name: this.user.userName,
          avatar: this.user.avatar,
          date: new Date(),
        },
      };
      //Ajout réactions dans collection des réactions du SEANCENOW
      this.feedService.createReactionSeanceNow(this.feed[i], reactionPost);
    }
    this.feedService.updatePost(this.feed[i]);
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

  async presentPopover(i: number, feedLik) {
    const modal = await this.modalController.create({
      component: EmojisComponent,
      cssClass: 'modalEmojis',
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {
      this.reaction = data.data;
      this.controleReaction(i, feedLik.reactions);
      this.reaction = null;
    });
    return await modal.present();
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
