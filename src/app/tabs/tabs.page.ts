import { Component, OnInit } from '@angular/core';
import { MusicFeedService } from '../services/music-feed.service';
import {
  ModalController,
  AnimationController,
  NavController,
} from '@ionic/angular';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';
import {AddContenuComponent} from "../session-now/add-contenu/add-contenu.component";
import {ExternalSessionNowComponent} from "../session-now/external-session-now/external-session-now.component";

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
    public navController: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  changeTab(event) {
    event.tab != 'tab1'
      ? this.msService.currentPlay$.next(false)
      : this.msService.currentPlay$.next(true);
  }


  launch() {
    this.navController.navigateForward(['session-now']);
  }

  /**
   * this function call externalApp in a Modal
   */
  async launchExternalApp(){
    console.log(1);
      const modal = await this.modalCtrl.create({
        component: ExternalSessionNowComponent,
        cssClass: 'my-custom-contenu-modal',
      });
      modal.onDidDismiss().then((data: any) => {

      });
      return await modal.present();
  }
}
