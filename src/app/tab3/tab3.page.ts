import {
  AfterContentChecked,
  Component,
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
import { UserServiceService as UserService } from '../services/user-service.service';
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

  segmentValue: string = 'championnats';

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @ViewChildren('miniature') miniature: any;
  challenges: Observable<any>;
  userChampionnats: Observable<any>;
  championnats: Observable<any>;
  championnatsNetwork: Observable<any>;
  bannData: any;
  affiche: BehaviorSubject<any> = new BehaviorSubject(null);
  user: any;
  constructor(
    private modalController: ModalController,
    public animationCtrl: AnimationController,
    public http: HttpClient,
    public userService: UserService,
    public champService: ChampionnatsService
  ) {}

  ngOnInit() {
    const user = from(this.userService.getCurrentUser());
    user.pipe(tap((us) => console.log(us))).subscribe((us) => (this.user = us));

    this.challenges = this.http.get('../../assets/mocks/challenges.json').pipe(
      tap((r) => {
        this.bannData = r[0];
      })
    );
    this.userChampionnats = this.http
      .get('../../assets/mocks/userChamp.json')
      .pipe(tap((r) => console.log(r)));

    this.champService.getChampionnats();
    this.championnats = this.champService.champSubject$.pipe(
      tap((r) => console.log(r))
    );
    // this.http
    //   .get('../../assets/mocks/championnats.json')
    //   .pipe(
    //     map((r) => _.filter(r, ['type', 'Friends&Familly'])),
    //     tap((r) => console.log(r))
    //   );

    this.championnatsNetwork = this.http
      .get('../../assets/mocks/championnats.json')
      .pipe(
        map((r) => _.filter(r, ['type', 'Network'])),
        tap((r) => console.log(r))
      );
  }

  ngAfterContentChecked(): void {}

  async buttonClick() {
    const modal = await this.modalController.create({
      component: CreateChampPopUpComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
  }

  navigate() {
    window.location.href = 'http://localhost:8100';
  }

  challChoice(event) {
    this.affiche.next(event);
    console.log(event);
    this.bannData = event;
    console.log(this.bannData);
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

      // enterAnimation,
      // leaveAnimation,
    });
    return await modal.present();
  }

  async launchDetail(ev) {
    //   console.log(ev);
    //   console.log(index);
    //   console.log(ev.target.getBoundingClientRect());
    //   const yPos = ev.target.getBoundingClientRect().y;
    //   const xPos = ev.target.getBoundingClientRect().x;
    //   const enterAnimation = (baseEl: any) => {
    //     const backdropAnimation = this.animationCtrl.create()
    //       .addElement(baseEl.querySelector('ion-backdrop'))
    //       .fromTo('opacity', '0', '0');

    //     const wrapperAnimation = this.animationCtrl.create()
    //       .addElement(baseEl.querySelector('.modal-wrapper'))
    //       .easing('cubic-bezier(0.36,0.66,0.04,1)')
    //       .beforeStyles({ 'opacity': 0, 'transform': 'scale(0)' })
    //       .fromTo('translateX', '0%', '0%')
    //       .keyframes([
    //         { offset: 0, opacity: '0', transform: 'scale(1)' },
    //         { offset: 1, opacity: '1', transform: 'scale(1)' }
    //       ]);

    //     // const slide = slideNum == "slide1" ? document.querySelectorAll('slideDiv') : document.querySelectorAll('.slide2');
    //     const slide = document.querySelectorAll('.slideDiv1');
    //     console.log(slide);
    //     console.log(slide[index]);
    //     const miniature = this.animationCtrl.create()
    //       .addElement(slide[index])
    //       .easing('linear')
    //       // .fromTo('opacity', '0', '0')
    //       .keyframes([
    //         { offset: 0, opacity: '1' },
    //         { offset: 0.5, opacity: '0' },
    //         { offset: 1, opacity: '0' }
    //       ])
    //       .duration(850);

    //   return this.animationCtrl.create()
    //     .addElement(baseEl)
    //     // .easing('linear')
    //     .duration(2000)
    //     .beforeAddClass('show-modal')
    //     .addAnimation([
    //       backdropAnimation,
    //       wrapperAnimation,
    //       miniature
    //     ])
    // }

    // const leaveAnimation = (baseEl: any) => {
    //   return enterAnimation(baseEl).direction('reverse');
    // }

    const modal = await this.modalController.create({
      component: ModalChampComponent,
      // enterAnimation,
      // leaveAnimation,
      cssClass: 'testModal',
      componentProps: {
        championnat: ev,
      },
    });
    return await modal.present();
  }
}
