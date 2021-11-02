import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { getAuth } from '@firebase/auth';
import { ModalController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { first, last, skip, take, takeLast, tap } from 'rxjs/operators';
import { ChatRoomComponent } from '../components/chat-room/chat-room.component';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  roomsSub: Subscription;
  currentUSer: any;
  roomTable: any[] = [];
  constructor(
    public chatService: ChatService,
    public userSerive: UserService,
    public modalController: ModalController,
    public navController: NavController,
    public ref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const auth = getAuth();
    console.log;

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.chatService.getUserRoom(user.uid);
        this.roomsSub = this.chatService.roomSubject$
          .pipe(skip(1))
          .subscribe((room) => {
            const roomPlace = room;
            if (roomPlace) {
              roomPlace.forEach((rooms) => {
                const roomTemp = rooms;
                const findIndex = rooms.users.findIndex(
                  (us) => us.uid != user.uid
                );
                roomTemp.users = roomTemp.users[findIndex];
                this.roomTable.push(roomTemp);
              });
            }
          });
      }
    });
  }

  async openChat(room) {
    this.currentUSer = await this.userSerive.getCurrentUser();
    const modal = await this.modalController.create({
      component: ChatRoomComponent,
      componentProps: {
        user: this.currentUSer,
        contact: room.users,
        id: room.uid,
      },
    });
    return await modal.present();
  }

  back() {
    this.navController.navigateBack('');
  }

  ngOnDestroy() {
    this.roomsSub.unsubscribe();
  }
}
