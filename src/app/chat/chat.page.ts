import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { getAuth } from '@firebase/auth';
import { ModalController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { first, last, skip, take, takeLast, tap } from 'rxjs/operators';
import { ChatRoomComponent } from '../components/chat-room/chat-room.component';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user-service.service';

interface Message {
  dateCreation: Date;
  lastMsg: string;
  timestamp: Date;
  uid: string;
  users: any[];
  userInfo: any;
}

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
    const user = auth.currentUser;
    console.log(user);
    this.chatService.getUserRoom(user.uid);
    this.chatService.roomSubject$
      .pipe(
        tap((r: Message) => {
          console.log(r);
          r ? this.roomTable.push(r) : (this.roomTable = []);
        })
      )
      .subscribe();
  }

  async openChat(room) {
    this.currentUSer = await this.userSerive.getCurrentUser();
    const modal = await this.modalController.create({
      component: ChatRoomComponent,
      componentProps: {
        user: this.currentUSer,
        contact: room.userInfo,
        id: room.uid,
        room: room,
      },
    });
    modal
      .onDidDismiss()
      .then(() => this.chatService.getUserRoom(this.currentUSer.uid));
    return await modal.present();
  }

  back() {
    this.navController.navigateBack('');
  }

  ngOnDestroy() {
    this.chatService.unsubscribeRoom();
  }
}
