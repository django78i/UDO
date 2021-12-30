import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user-service.service';
import { UserProfilComponent } from '../user-profil/user-profil.component';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.scss'],
})
export class MenuUserComponent implements OnInit {
  @Input() user: any;
  ratio: number = 0;
  xpNewOnTotal: number;
  max: number;

  constructor(
    public modalController: ModalController,
    public userService: UserService,
    public navCtl: NavController
  ) {}

  ngOnInit() {
    const xpMAx = Number(this.user.niveau * 100);
    this.max = this.user.niveau * 100;
    this.xpNewOnTotal = this.user.exp / xpMAx;
    console.log(this.xpNewOnTotal);
  }

  async openProfil(ev) {
    this.close();
    const modal = await this.modalController.create({
      component: UserProfilComponent,
      componentProps: {
        userId: this.user.uid,
        userInfo: this.user,
        segment : ev
      },
    });
    return await modal.present();
  }

  rootCompetition() {
    this.navCtl.navigateForward('tabs/tab3');
    this.close();
  }

  close() {
    this.modalController.dismiss();
  }

  logout() {
    this.userService.logout();
    this.close();
  }
}
