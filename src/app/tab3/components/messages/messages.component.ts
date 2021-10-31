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
      (champ) => {
        this.messagesList = champ;
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
    modal.onDidDismiss().then((data) => {
      if (data.data == 'encore') {
        this.modalController.dismiss();
      }
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
