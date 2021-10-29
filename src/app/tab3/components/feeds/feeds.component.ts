import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { from, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmojisComponent } from 'src/app/components/emojis/emojis.component';
import { MusicFeedService } from 'src/app/services/music-feed.service';
import { DetailPostComponent } from '../detail-post/detail-post.component';

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

  constructor(
    public musService: MusicFeedService,
    public http: HttpClient,
    public navCtl: NavController,
    public popoverController: PopoverController,
    public mService: MusicFeedService,
    public modalController: ModalController
  ) {}

  async ngOnInit() {
    console.log(this.user);
    this.feed$ = from(this.mService.feedQuery());
    this.subscription = this.feed$.subscribe((f) => {
      this.lastVisible = f.last;
      f.table.forEach((fee) => {
        this.feed.push(fee);
        console.log(this.feed);
      });
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
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
      let isEmojiIsToUser;

      //l'émoji existe déjà
      const isEmojiExist = react.findIndex((f) => f.nom == this.reaction.nom);

      //le user a déjà envoyé cet émoji
      if (isEmojiExist != -1) {
        isEmojiIsToUser = react[isEmojiExist].users.findIndex(
          (user) => user.uid == this.user.uid
        );
      }
      let indice;
      let userAlreadyLike;
      react.map((react, index) => {
        //l'utiisateur a déjà un like actif
        const ind = react.users.findIndex((us) => us.uid == this.user.uid);
        if (ind != -1) {
          indice = index;
          userAlreadyLike = ind;
        }
      });

      if (isEmojiIsToUser != -1 && isEmojiIsToUser) {
        return;
      } else if (isEmojiExist != -1 && isEmojiExist) {
        this.feed[i].reactions[isEmojiExist].nombre += 1;
        this.feed[i].reactions[isEmojiExist].users.push({
          uid: this.user.uid,
          name: this.user.userName,
          date: new Date(),
          avatar: this.user.avatar,
        });
      } else  {
        this.feed[i].reactions.push({
          ...this.reaction,
          nombre : 1,
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
      this.musService.updatePost(this.feed[i]);
    });
    return await modal.present();
  }

  async loadData(event) {
    const taille = await this.mService.getFeed();
    const feedPlus = from(this.mService.addQuery(this.lastVisible));
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }
}
