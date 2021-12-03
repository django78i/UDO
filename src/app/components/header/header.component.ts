import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user-service.service';
import { MenuUserComponent } from '../menu-user/menu-user.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() user: any;
  constructor(
    public userService: UserService,
    public modalController: ModalController,
    public navCtl: NavController
  ) {}

  ngOnInit() {
    // this.userService.getCurrentUser().then((user) => (this.user = user));
  }

  ngOnChanges() {}

  async showMenu() {
    const modal = await this.modalController.create({
      component: MenuUserComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
  }

  chatPage() {
    this.navCtl.navigateForward('chat');
  }
}
