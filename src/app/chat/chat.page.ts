import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChatRoomComponent } from '../components/chat-room/chat-room.component';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  rooms$: Observable<any>;
  currentUSer: any;
  roomTable: any[] = [];
  constructor(
    public chatService: ChatService,
    public userSerive: UserService,
    public modalController: ModalController,
    public navController: NavController
  ) {}

  async ngOnInit() {
    this.currentUSer = await this.userSerive.getCurrentUser();
    console.log;

    this.chatService.getUserRoom(this.currentUSer.uid);
    this.rooms$ = this.chatService.roomSubject$.pipe(
      tap((rooms) => {
        this.roomTable = [];
        if (rooms) {
          rooms.map((room) => {
            const roomTemp = room;
            const findIndex = roomTemp.users.findIndex(
              (us) => us != this.currentUSer.uid
            );
            roomTemp.users.splice(findIndex, 1);
            this.roomTable.push(roomTemp);
            console.log(this.roomTable);
          });
        }
      })
    );
  }

  async openChat(room) {
    this.currentUSer = await this.userSerive.getCurrentUser();
    const modal = await this.modalController.create({
      component: ChatRoomComponent,
      componentProps: {
        user: this.currentUSer,
        contact: room.users[0],
        id: room.uid,
      },
    });
    return await modal.present();
  }

  back() {
    this.navController.navigateBack('');
  }
}
