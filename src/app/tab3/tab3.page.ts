import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AnimationController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { BehaviorSubject, from, Observable, Subscription } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { ModalChampComponent } from './components/modal-champ/modal-champ.component';
import { filter, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { CreateChampPopUpComponent } from './components/create-champ-pop-up/create-champ-pop-up.component';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';
import { UserService as UserService } from '../services/user-service.service';
import { ChampionnatsService } from '../services/championnats.service';
import { NavigationExtras, Router } from '@angular/router';
import { ChallengesService } from '../services/challenges.service';
import { CreateChallPopUpComponent } from './components/create-chall-pop-up/create-chall-pop-up.component';
// import { CreateChallPopUpComponent } from './components/create-chall-pop-up/create-chall-pop-up.component';
// import { ChallengesService } from '../services/challenges.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit, AfterContentChecked, OnDestroy {
  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  temporaire = [1, 2, 3];

  segmentValue: string = 'championnats';

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @ViewChildren('miniature') miniature: any;
  challenges: Observable<any>;

  //championnats
  champinonatNetwork: any[] = [];
  championnatsList: any[] = [];
  userChampionnats: any[] = [];
  championnatTermines: any[] = [];

  //Challenges
  challengesEnAttente: any[] = [];
  challengesEnCours: any[] = [];
  challengesUser: any[] = [];
  challengesTermines: any[] = [];

  bannData: any;
  affiche: BehaviorSubject<any> = new BehaviorSubject(null);
  user: any;
  user$: Observable<any>;
  userInfo: any;

  //loader
  loaderUserChamp: boolean;
  loader: boolean = true;
  loaderNetwork: boolean;

  constructor(
    private modalController: ModalController,
    public animationCtrl: AnimationController,
    public http: HttpClient,
    public userService: UserService,
    public champService: ChampionnatsService,
    private ref: ChangeDetectorRef,
    public navController: NavController,
    public router: Router,
    public navCtl: NavController,
    public challServ: ChallengesService
  ) {}

  ngOnInit() {
    this.loader = true;
    //user en cours
    console.log(this.champService.champSubject$);
    this.userService.getCurrentUser().then((user) => (this.user = user));

    this.champService.getChampionnats();
    this.champService.champSubject$
      .pipe(
        tap((r) => {
          console.log(this.championnatsList);
          r == null
            ? (this.championnatsList = [])
            : this.championnatsList.push(r);
        })
      )
      .subscribe();
    this.champService.champEnCoursSubject$
      .pipe(
        tap((r) => {
          r == null
            ? (this.userChampionnats = [])
            : this.userChampionnats.push(r);
        })
      )
      .subscribe();
    this.champService.champNetWork$
      .pipe(
        tap((r) => {
          console.log(r);
          r == null
            ? (this.champinonatNetwork = [])
            : this.champinonatNetwork.push(r);
        })
      )
      .subscribe();
    this.champService.champtermines$
      .pipe(
        tap((r) =>
          r == null
            ? (this.championnatTermines = [])
            : this.championnatTermines.push(r)
        )
      )
      .subscribe();
    this.challServ.getChallenges();

    this.challServ.challenges$
      .pipe(
        tap((r) => {
          console.log(r);
          r == null
            ? (this.challengesEnAttente = [])
            : this.challengesEnAttente.push(r);
        })
      )
      .subscribe();
    this.challServ.challengeEnCours$
      .pipe(
        tap((r) => {
          console.log(r);
          r == null
            ? (this.challengesEnCours = [])
            : this.challengesEnCours.push(r);
        })
      )
      .subscribe();
    this.challServ.challengeUser$
      .pipe(
        tap((r) => {
          console.log(r);
          r == null ? (this.challengesUser = []) : this.challengesUser.push(r);
        })
      )
      .subscribe();
    this.challServ.challengeTermines$
      .pipe(
        tap((r) => {
          console.log(r);
          r == null
            ? (this.challengesTermines = [])
            : this.challengesTermines.push(r);
        })
      )
      .subscribe();
  }
  ionViewWillEnter() {
    this.ref.detectChanges();
  }

  ionViewDidEnter() {
    this.loader = false;
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.map((swip) => swip.updateSwiper({}));
    }
  }

  async getUser() {
    const user = await this.userService.getCurrentUser();
    return user;
  }

  async buttonClick(ev) {
    const modal = await this.modalController.create({
      component: CreateChampPopUpComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
  }

  viewChange(ev) {
    this.segmentValue = ev.detail.value;
  }

  challChoice(event) {
    this.affiche.next(event);
    this.bannData = event;
    this.ref.detectChanges();
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

  async createChallenge(ev) {
    const modal = await this.modalController.create({
      component: CreateChallPopUpComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
  }

  viewCompetitions(ev) {
    this.navCtl.navigateForward('competitionsList');
  }

  async launchDetail(ev) {
    const position =
      ev.participants.findIndex((champ) => champ.uid == this.user.uid) + 1;

    const participantsList = ev.participants.slice(0, 4);

    const modal = await this.modalController.create({
      component: ModalChampComponent,
      componentProps: {
        champId: ev.uid,
        entryData: 'championnats',
        competition: ev,
        position: position,
        participantsList: participantsList,
        userEncours: this.user,
      },
    });
    return await modal.present();
    // this.router.navigate([`/championnat/${ev.uid}`]);
  }

  async openChallenge(ev) {
    console.log(ev);
    const modal = await this.modalController.create({
      component: ModalChampComponent,
      componentProps: {
        champId: ev.uid,
        entryData: 'challenges',
        competition: ev,
      },
    });
    return await modal.present();
  }

  chatPage() {
    this.router.navigate(['chat']);
  }

  ngOnDestroy() {
    this.champService.unsubscribe();
    this.champService.unsubscribe2();
  }
}
