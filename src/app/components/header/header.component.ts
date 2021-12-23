import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user-service.service';
import { MenuUserComponent } from '../menu-user/menu-user.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() user: any;
  alert: Observable<boolean>;

  constructor(
    public userService: UserService,
    public modalController: ModalController,
    public navCtl: NavController,
    public chatService: ChatService
  ) {}

  ngOnInit() {
    this.alert = this.chatService.msgAlert;
    this.userService.getCurrentUser().then((user) => {
      this.chatService.getUserRoom(user.uid);
    });
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

  async notificationsPage() {
    const modal = await this.modalController.create({
      component: NotificationsComponent,
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
