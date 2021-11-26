import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(
    public modalController: ModalController,
    public userService: UserService
  ) {}

  ngOnInit() {
    const xpMAx = Number(this.user.niveau * 100);
    this.ratio = this.user.exp / xpMAx;
  }

  async openProfil() {
    this.close();
    const modal = await this.modalController.create({
      component: UserProfilComponent,
      componentProps: {
        userId: this.user.uid,
        currentUser: this.user,
      },
    });
    return await modal.present();
  }

  close() {
    this.modalController.dismiss();
  }

  logout() {
    this.userService.logout();
    this.close();
  }
}
