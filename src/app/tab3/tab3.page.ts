import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AnimationController, ModalController } from '@ionic/angular';
import { BehaviorSubject, from, Observable } from 'rxjs';
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

  temporaire= [1, 2, 3];

  segmentValue: string = 'championnats';

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @ViewChildren('miniature') miniature: any;
  challenges: Observable<any>;
  userChampionnats$: Observable<any>;
  userChampionnats: any;
  championnats: Observable<any>;
  championnatsNetwork: Observable<any>;
  bannData: any;
  affiche: BehaviorSubject<any> = new BehaviorSubject(null);
  user: any;
  user$: Observable<any>;
  userInfo: any;

  constructor(
    private modalController: ModalController,
    public animationCtrl: AnimationController,
    public http: HttpClient,
    public userService: UserService,
    public champService: ChampionnatsService,
    public zone: NgZone,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user$ = from(this.userService.getCurrentUser());
    this.user$
      .pipe(
        tap((us) => {
          this.user = us;
          this.champService.getChampionnatsEnCours(this.user);
          this.userChampionnats$ = this.champService.champEnCoursSubject$

          this.champService.getChampionnats(this.user);
          this.championnats = this.champService.champSubject$.pipe(
            tap((r) => this.ref.detectChanges())
          );
        })
      )
      .subscribe();

    this.challenges = this.http.get('../../assets/mocks/challenges.json').pipe(
      tap((r) => {
        this.bannData = r[0];
      })
    );

    this.championnatsNetwork = this.http
      .get('../../assets/mocks/championnats.json')
      .pipe(map((r) => _.filter(r, ['type', 'Network'])));
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
}
