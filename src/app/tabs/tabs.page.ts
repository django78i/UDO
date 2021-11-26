import { Component, OnInit, ViewChild } from '@angular/core';
import { MusicFeedService } from '../services/music-feed.service';
import {
  ModalController,
  AnimationController,
  NavController, Platform, AlertController, IonRouterOutlet,
} from '@ionic/angular';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';
import { AddContenuComponent } from '../session-now/add-contenu/add-contenu.component';
import { ExternalSessionNowComponent } from '../session-now/external-session-now/external-session-now.component';
import { CreatePostComponent } from './component/create-post/create-post.component';
import { UserService } from '../services/user-service.service';

import {RouterOutlet, Router, ActivationStart, NavigationExtras} from '@angular/router';
import {Plugins} from "@capacitor/core";
const { App } = Plugins;

import {
  RouterOutlet,
  Router,
  ActivationStart,
  NavigationExtras,
} from '@angular/router';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  user: any;
  @ViewChild(RouterOutlet) outlet: RouterOutlet;

  constructor(
    private router: Router,
    public modalController: ModalController,
    public animationCtrl: AnimationController,
    public msService: MusicFeedService,
    public navController: NavController,
    private modalCtrl: ModalController,
    public userService: UserService,
    private platform: Platform,
    public alertController: AlertController,
    private routerOutlet: IonRouterOutlet
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.presentAlertConfirm();
    });
    this.userService.getUsers();
  }

  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
    this.userService.getCurrentUser().then((user) => {
      this.user = user;
    });
  }

  changeTab(event) {
    event.tab != 'tab1'
      ? this.msService.currentPlay$.next(false)
      : this.msService.currentPlay$.next(true);
  }

  launch() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'Séance Libre',
        // type: 'Championnat',
        //type: 'Challenge',
        competitionName:'',
        competitionId:'',
        challengeStatus:0,
        challengeMetric:''
      }
    };
    this.navController.navigateForward(['session-now'], navigationExtras);
  }

  /**
   * this function call externalApp in a Modal
   */
  async launchExternalApp() {
    console.log(1);
    const modal = await this.modalCtrl.create({
      component: ExternalSessionNowComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }
  async createPost() {
    const modal = await this.modalCtrl.create({
      component: CreatePostComponent,
      componentProps: {
        user: this.user,
      },
      // cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }
  /**
   * cette alert permet de confirmer la sortie de l'application
   */
  async presentAlertConfirm() {

    const alert = await this.alertController.create({
      header: 'Confirmation',
      mode: 'ios',
      message: 'Voulez vous vraiment quitter cette application',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          },
        },
        {
          text: 'Oui',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });

    await alert.present();
  }

}
