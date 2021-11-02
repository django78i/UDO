import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  NgZone,
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
    public zone: NgZone,
    private ref: ChangeDetectorRef,
    public navController: NavController,
    public router: Router,
    public navCtl: NavController
  ) {}

  ngOnInit() {
    this.user$ = from(this.userService.getCurrentUser());
    this.user$.subscribe((user) => {
      this.user = user;
      //Championnats en cours
      this.champService.getChampionnatsEnCours(this.user);
      this.loaderUserChamp = true;
      this.userChampSubscription =
        this.champService.champEnCoursSubject$.subscribe((champ) => {
          this.loaderUserChamp = false;
          this.userChampionnats = champ;
        });
      //Championnats en attente
      this.champService.getChampionnats(this.user);
      this.loaderChamp = true;
      this.championnatSubscription = this.champService.champSubject$.subscribe(
        (champ) => {
          this.loaderChamp = false;
          this.championnatsList = champ;
          this.ref.detectChanges();
        }
      );
      this.champService.getChampionnatNetwork(this.user);
      this.loaderNetwork = true;
      this.championnatNetWorkSubscription =
        this.champService.champNetWork$.subscribe((champ) => {
          this.loaderNetwork = false;
          this.championnatsNetwork = champ;
        });
    });

    this.challenges = this.http.get('../../assets/mocks/challenges.json').pipe(
      tap((r) => {
        this.bannData = r[0];
      })
    );

    //   this.championnatsNetwork = this.http
    //     .get('../../assets/mocks/championnats.json')
    //     .pipe(map((r) => _.filter(r, ['type', 'Network'])));
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.map((swip) => swip.updateSwiper({}));
    }
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
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.0', '0');

      const wrapperAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'translateX(-300px)', 'translateX(0px)');

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    const modal = await this.modalController.create({
      component: MenuUserComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
  }

  async launchDetail(ev) {
    const modal = await this.modalController.create({
      component: ModalChampComponent,
      cssClass: 'testModal',
      componentProps: {
        user: this.user,
        championnat: ev,
      },
    });
    return await modal.present();
  }

  chatPage() {
    // this.navCtl.navigateForward('chat');
    this.router.navigate(['chat']);
  }
}
