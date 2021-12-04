import {
  Component,
  ViewChildren,
  QueryList,
  ViewChild,
  Renderer2,
  ElementRef,
  AfterContentChecked,
  OnInit,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { MusicFeedService } from '../services/music-feed.service';
import { HttpClient } from '@angular/common/http';
import { from, Observable, Subscription } from 'rxjs';
import { IonItem, NavController, PopoverController } from '@ionic/angular';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';
import { ModalController, AnimationController } from '@ionic/angular';
import { UserService } from '../services/user-service.service';
import { EmojisComponent } from '../components/emojis/emojis.component';
import { UserProfilComponent } from '../components/user-profil/user-profil.component';
import { SessionNowService } from '../services/session-now-service.service';
import { DetailPostComponent } from '../tab3/components/detail-post/detail-post.component';
import { EditPageComponent } from '../components/edit-page/edit-page.component';

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
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy, AfterContentChecked {
  // feed = data;
  feed: Observable<any>;
  feeds: any[] = [];
  challenges: Observable<any>;
  @ViewChildren('player') videoPlayers: QueryList<any>;
  currentPlaying: HTMLVideoElement = null;
  indice: number;
  stickyVideo: HTMLVideoElement = null;
  stickyPlaying = false;
  @ViewChild('stickyplayer', { static: false }) stickyPlayer: ElementRef;
  @ViewChildren('swiper2') swiper2: QueryList<SwiperComponent>;
  @ViewChildren('filterItem') filterItem: QueryList<any>;

  config2: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 10,
  };

  filters = [
    {
      icon: '',
      name: 'Récent',
    },
    {
      icon: '../../assets/icon/live.svg',
      name: 'En direct',
    },
    {
      icon: '../../assets/icon/friends.svg',
      name: 'Populaire',
    },
    {
      icon: '../../assets/icon/tendance.svg',
      name: 'Mes amis',
    },
  ];

  value = 70;
  mode = 'determinate';
  diameter = 70;
  color = 'dark';
  soundMute = true;
  user: any;
  subscription: Subscription;
  lastVisible: any;
  loading: boolean = true;
  reaction: any;
  filter: string = 'Récent';
  constructor(
    public modalController: ModalController,
    public animationCtrl: AnimationController,
    public feedService: MusicFeedService,
    public http: HttpClient,
    public navCtl: NavController,
    public userService: UserService,
    public ref: ElementRef,
    public snsService: SessionNowService,
    public popoverController: PopoverController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('ionViewDidEnter');
    const user = from(this.userService.getCurrentUser());
    this.subscription = user.subscribe((us) => {
      this.user = us;
      this.controlLivePost();
    });
    this.getFeeds();
  }

  async controlLivePost() {
    const feed = await this.snsService.controlLive(this.user.uid);
    this.refreshFeed();
  }

  async getFeeds() {
    const feed = await this.feedService.feedFilter('Récent');
    this.loading = false;
    this.feeds = feed.table;
    this.lastVisible = feed.last;
    this.indice = 0;
  }

  ngAfterContentChecked() {
    if (this.swiper2) {
      this.swiper2.map((swip) => swip.updateSwiper({}));
    }
  }

  async showMenu() {
    const modal = await this.modalController.create({
      component: MenuUserComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
  }

  //Recharger le feed
  async loadData(event) {
    const taille = await this.feedService.feedFilter(this.filter);
    const feedPlus = await this.feedService.addQuery(
      this.lastVisible,
      this.filter
    );
    setTimeout(() => {
      event.target.complete();
      this.lastVisible = feedPlus.last;
      feedPlus.table.forEach((fed) => this.feeds.push(fed));
      if (taille.last.data() <= this.feeds.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  //Refresh du feed
  async doRefresh(event) {
    this.feeds = [];
    const feedRefresh = await this.feedService.feedFilter(this.filter);
    setTimeout(() => {
      event ? event.target.complete() : '';
      this.feeds = feedRefresh.table;
      this.lastVisible = feedRefresh.last;
    }, 2000);
  }

  //Choix du filtre
  async clickFilter(filter: string, i) {
    this.snsService.presentLoading();
    this.indice = i;
    this.feeds = [];
    this.filter = filter;
    const feedRefresh = await this.feedService.feedFilter(filter);
    this.feeds = feedRefresh.table;
    this.lastVisible = feedRefresh.last;
    this.snsService.dissmissLoading();
  }

  async presentPopover(i: number, feedLik) {
    const modal = await this.modalController.create({
      component: EmojisComponent,
      cssClass: 'modalEmojis',
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {
      this.reaction = data.data;
      if (data.data) {
        this.controleReaction(i, feedLik.reactions, data.data);
      }
      this.reaction = null;
    });
    return await modal.present();
  }

  controleReaction(i: number, reactions?: any[], reaction?: any) {
    const react: Reaction[] = reactions;
    //l'émoji existe déjà
    const isEmojiExist = react.findIndex((f) =>
      reaction ? f.nom == reaction.nom : f.nom == reaction.nom
    );

    if (isEmojiExist != -1) {
      //incrémente de 1 compteur général réactions
      this.feeds[i].reactionsNombre += 1;

      //incrémente de 1 compteur de la réaction
      this.feeds[i].reactions[isEmojiExist].nombre += 1;

      //Ajout user dans le tableau des users de la réaction
      this.feeds[i].reactions[isEmojiExist].users.push({
        uid: this.user.uid,
        name: this.user.userName,
        avatar: this.user.avatar,
        date: new Date(),
      });
    } else {
      //incrémente de 1 compteur général réactions
      this.feeds[i].reactionsNombre = this.feeds[i].reactionsNombre + 1;
      this.feeds[i].reactions.push({
        ...reaction,
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

    //création object réactions pour le séanceNow
    if (this.feeds[i].type == 'session-now') {
      // const reactionFilter = this.reaction ? this.reaction : reaction;
      const reactionPost = {
        reaction,
        user: {
          uid: this.user.uid,
          name: this.user.userName,
          avatar: this.user.avatar,
          date: new Date(),
        },
      };
      //Ajout réactions dans collection des réactions du SEANCENOW
      this.feedService.createReactionSeanceNow(this.feeds[i], reactionPost);
    }
    this.feedService.updatePost(this.feeds[i]);
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

  async presentEditPost(ev, postUid) {
    const popover = await this.popoverController.create({
      component: EditPageComponent,
      event: ev,
      cssClass: 'my-custom-class',
      componentProps: {
        uid: postUid,
        filter: this.filter,
      },
    });
    await popover.present();

    popover.onDidDismiss().then((data) => {
      if (data.data) {
        console.log(data);
        this.refreshFeed();
      }
    });
  }

  refreshFeed() {
    const event = null;
    this.snsService.presentLoading();
    this.doRefresh(event).then(() => this.snsService.dissmissLoading());
  }

  async openProfil(contact) {
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

  chatPage() {
    this.navCtl.navigateForward('chat');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async userProfil() {
    const modal = await this.modalController.create({
      component: UserProfilComponent,
      componentProps: {
        userId: this.user.uid,
        currentUser: this.user,
      },
    });
    return await modal.present();
  }
}
