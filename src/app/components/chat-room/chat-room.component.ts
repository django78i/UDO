import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first, last, takeLast, tap } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {
  @Input() contact: any;
  @Input() user: any;
  @Input() id: any;
  message$: Observable<any>;
  text;
  @ViewChild('inputMsg') input: IonInput;

  constructor(
    public modaCtl: ModalController,
    public chatService: ChatService,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(this.contact, this.user, this.id);
    this.chatService.getMessages(this.id);
    this.message$ = this.chatService.msgSubject$.pipe(
      tap((r) => {
        console.log(r);
      })
    );
  }

  close() {
    this.modaCtl.dismiss();
  }

  getText(ev) {
    this.text = ev.detail.value;
  }

  send() {
    console.log(this.user);
    const msg = {
      text: this.text,
      date: new Date(),
      senderId: this.user.uid,
      senderName: this.user.userName,
      recipientName: this.contact.userName,
      recipientId: this.contact.uid,
    };
    this.chatService.sendMessage(this.id, msg);
    this.input.value = null;
  }
}
