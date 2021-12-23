import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

import { NotificationService } from 'src/app/services/notification-service.service';
import { UserProfilComponent } from '../user-profil/user-profil.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  @Input() user: any;
  userNotif: any[] = [];

  constructor(
    public notifService: NotificationService,
    public modalController: ModalController,
    public navCtl: NavController
  ) {}

  ngOnInit() {
    this.getNotif();
  }

  async getNotif() {
    this.userNotif = await this.notifService.getNotifications(this.user.uid);
    console.log(this.userNotif);
  }

  //Recharger le feed
  async loadData(event) {
    // const taille = await this.feedService.feedFilter(this.filter);
    // const feedPlus = await this.feedService.addQuery(
    //   this.lastVisible,
    //   this.filter
    // );
    setTimeout(() => {
      event.target.complete();
      // this.lastVisible = feedPlus.last;
      // feedPlus.table.forEach((fed) => this.feeds.push(fed));
      // if (taille.last.data() <= this.feeds.length) {
      //   event.target.disabled = true;
      // }
    }, 500);
  }

  async openProfil(ev) {
    const modal = await this.modalController.create({
      component: UserProfilComponent,
      componentProps: {
        userId: ev,
        // currentUser: this.user,
        segment: 'resume',
      },
    });
    return await modal.present();
  }

  navigate(notif) {
    console.log(notif);
    switch (notif.type) {
      case 'invitation championnat Network':
        this.navCtl.navigateForward(`championnat/${notif.linkId}`);
        break;
      case 'invitation championnat Friends&Familly':
        this.navCtl.navigateForward(`championnat/${notif.linkId}`);
        break;
      case 'démarrage championnat Friends&Familly':
        this.navCtl.navigateForward(`championnat/${notif.linkId}`);
        break;
      case 'démarrage championnat NetWork':
        this.navCtl.navigateForward(`championnat/${notif.linkId}`);
        break;
      case 'démarrage challenge':
        this.navCtl.navigateForward(`challenge/${notif.linkId}`);
        break;
      case 'invitation challenge':
        this.navCtl.navigateForward(`challenge/${notif.linkId}`);
        break;
      case 'invitation amis':
        this.openProfil(notif.senderId);
        break;
    }
    this.modalController.dismiss();
  }

  delete(notifId) {
    this.notifService.deleteNotif(notifId);
  }

  back(ev) {
    this.modalController.dismiss(ev);
  }
}
