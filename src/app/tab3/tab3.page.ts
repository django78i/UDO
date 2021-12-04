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

  //Challenges
  challengesEnAttente: any[] = [];
  challengesEnCours: any[] = [];
  challengesUser: any[] = [];

  bannData: any;
  affiche: BehaviorSubject<any> = new BehaviorSubject(null);
  user: any;
  user$: Observable<any>;
  userInfo: any;

  //loader
  loaderUserChamp: boolean;
  loaderChamp: boolean;
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
    //user en cours
    this.userService.getCurrentUser().then((user) => (this.user = user));

    this.champService.getChampionnats();
    this.challServ.getChallenges();

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
    this.ref.detectChanges();
    this.challServ.challengeUser$
      .pipe(
        tap((r) => {
          console.log(r);
          r == null
            ? (this.challengesUser = [])
            : this.challengesUser.push(r);
        })
      )
      .subscribe();
    this.ref.detectChanges();

  }

  ionViewDidEnter() {
    
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

  champModal(event) {
    this.launchDetail(event);
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
    this.router.navigate([`/championnat/${ev.uid}`]);
  }

  async openChallenge(ev) {
    console.log(ev);
    this.router.navigate([`/challenge/${ev}`]);
  }

  chatPage() {
    this.router.navigate(['chat']);
  }

  ngOnDestroy() {
    this.champService.unsubscribe();
    this.champService.unsubscribe2();
  }
}
