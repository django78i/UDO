import { Component, OnInit } from '@angular/core';
import { MusicFeedService } from '../services/music-feed.service';
import {
  ModalController,
  AnimationController,
  NavController,
} from '@ionic/angular';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(
    public modalController: ModalController,
    public animationCtrl: AnimationController,
    public msService: MusicFeedService,
    public navController: NavController
  ) {}

  ngOnInit() {}

  changeTab(event) {
    event.tab != 'tab1'
      ? this.msService.currentPlay$.next(false)
      : this.msService.currentPlay$.next(true);
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
      enterAnimation,
      leaveAnimation,
    });
    return await modal.present();
  }

  launch() {
    this.navController.navigateForward(['session-now']);
  }
}
