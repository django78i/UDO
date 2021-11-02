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
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { MusicFeedService } from '../services/music-feed.service';
import { HttpClient } from '@angular/common/http';
import { from, Observable, Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';
import { ModalController, AnimationController } from '@ionic/angular';
import { UserService } from '../services/user-service.service';
import { EmojisComponent } from '../components/emojis/emojis.component';
import { DetailPostComponent } from '../tab3/components/detail-post/detail-post.component';
import { UserProfilComponent } from '../components/user-profil/user-profil.component';

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
export class Tab1Page implements OnInit, OnDestroy {
  // feed = data;
  feed: Observable<any>;
  feeds: any[] = [];
  challenges: Observable<any>;
  @ViewChildren('player') videoPlayers: QueryList<any>;
  currentPlaying: HTMLVideoElement = null;

  stickyVideo: HTMLVideoElement = null;
  stickyPlaying = false;
  @ViewChild('stickyplayer', { static: false }) stickyPlayer: ElementRef;
  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @ViewChildren('swiper2') swiper2: QueryList<SwiperComponent>;

  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };
  config2: SwiperOptions = {
    slidesPerView: 3.1,
    spaceBetween: 10,
  };

  filters = [
    {
      icon: '',
      name: 'Récent',
    },
    {
      icon: '../../assets/icon/tendance.svg',
      name: 'Tendance',
    },
    {
      icon: '../../assets/icon/live.svg',
      name: 'En direct',
    },
    {
      icon: '../../assets/icon/friends.svg',
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
  constructor(
    public modalController: ModalController,
    public animationCtrl: AnimationController,
    public feedService: MusicFeedService,
    public http: HttpClient,
    public navCtl: NavController,
    public userService: UserService
  ) {}

  async ngOnInit() {
    const user = from(this.userService.getCurrentUser());
    this.subscription = user.subscribe((us) => {
      this.user = us;
    });
    const feed = await this.feedService.getFeed();
    this.loading = false;
    this.feeds = feed.table;
    console.log(this.feeds);
    this.lastVisible = feed.last;
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

  async loadData(event) {
    const taille = await this.feedService.getFeed();
    const feedPlus = await this.feedService.addQuery(this.lastVisible);

    setTimeout(() => {
      event.target.complete();
      this.lastVisible = feedPlus.last;
      feedPlus.table.forEach((fed) => this.feeds.push(fed));
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (taille.last <= this.feeds.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async doRefresh(event) {
    this.feeds = [];
    console.log(event);
    const feedRefresh = await this.feedService.getFeed();
    setTimeout(() => {
      event.target.complete();
      this.feeds = feedRefresh.table;
      this.lastVisible = feedRefresh.last;
    }, 2000);
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

      this.feeds[i].reactions[isEmojiExist].nombre += 1;
      this.feeds[i].reactions[isEmojiExist].users.push({
        uid: this.user.uid,
        name: this.user.userName,
        date: new Date(),
        avatar: this.user.avatar,
      });
    } else {
      console.log('la');

      this.feeds[i].reactions.push({
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
      this.feeds[i].reactions[indice].nombre -= 1;
      this.feeds[i].reactions[indice].users.splice(userAlreadyLike, 1);
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

  nav() {
    this.navCtl.navigateForward('tabs/tab3');
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
