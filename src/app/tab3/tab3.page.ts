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
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit, AfterContentChecked {
  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  temporaire = [1, 2, 3];

  segmentValue: string = 'championnats';

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @ViewChildren('miniature') miniature: any;
  challenges: Observable<any>;
  userChampionnats$: Observable<any>;
  userChampionnats: any[] = [];
  championnats: Observable<any>;
  championnatsList: any[] = [];
  championnatsNetwork: any[] = [];

  // championnatsNetwork: Observable<any>;
  bannData: any;
  affiche: BehaviorSubject<any> = new BehaviorSubject(null);
  user: any;
  user$: Observable<any>;
  userInfo: any;

  userChampSubscription: Subscription;
  userSubscription: Subscription;
  championnatSubscription: Subscription;
  championnatNetWorkSubscription: Subscription;

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
    public navCtl: NavController
  ) {}

  ngOnInit() {
    //récupéerer les user
    //Championnats en cours
    // this.champService.getChampionnatsEnCours();
    //Championnats en attente
    this.champService.getChampionnats();
    this.champService.champSubject$
      .pipe(
        tap((r) => {
          // r ? this.championnatsList.push(r) : (this.championnatsList = []);
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

    this.challenges = this.http.get('../../assets/mocks/challenges.json').pipe(
      tap((r) => {
        this.bannData = r[0];
      })
    );
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

  async buttonClick() {
    const modal = await this.modalController.create({
      component: CreateChampPopUpComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
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

  async launchDetail(ev) {
    const user = await this.userService.getCurrentUser();
    const modal = await this.modalController.create({
      component: ModalChampComponent,
      cssClass: 'testModal',
      backdropDismiss: true,
      componentProps: {
        user: user,
        championnat: ev,
      },
    });
    return await modal.present();
  }

  chatPage() {
    // this.navCtl.navigateForward('chat');
    this.router.navigate(['chat']);
  }

  // ngOnDestroy() {
  //   this.championnatNetWorkSubscription.unsubscribe();
  //   this.userSubscription.unsubscribe();
  //   this.championnatSubscription.unsubscribe();
  //   this.userChampSubscription.unsubscribe();
  // }
}
