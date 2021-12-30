import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { UserProfilComponent } from 'src/app/components/user-profil/user-profil.component';
import { ChampionnatsService } from 'src/app/services/championnats.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  message: any;
  @Input() post: any;
  @Input() user: any;
  messagesList: any;
  subscription: Subscription;
  constructor(
    public champService: ChampionnatsService,
    public ref: ChangeDetectorRef,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.champService.getMessage(this.post.uid);
    this.subscription = this.champService.messagesSubject$.subscribe(
      (messages) => {
        const usersList = JSON.parse(localStorage.getItem('usersList'));
        const msgFormat = messages?.map((message: any) => {
          return {
            ...message,
            sender: usersList.find((user) => message.sender.uid == user.uid),
          };
        });

        this.messagesList = msgFormat ? msgFormat : [];
        console.log(this.messagesList);
        this.ref.detectChanges();
      }
    );
  }

  async openProfil(sender) {
    console.log(sender);
    const modal = await this.modalController.create({
      component: UserProfilComponent,
      componentProps: {
        user: sender,
        currentUser: this.user,
      },
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
