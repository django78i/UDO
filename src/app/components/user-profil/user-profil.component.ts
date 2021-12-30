import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
  NavParams,
} from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user-service.service';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import * as _ from 'lodash';
import { SessionNowService } from 'src/app/services/session-now-service.service';
import { tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification-service.service';

interface Message {
  dateCreation: Date;
  lastMsg: string;
  timestamp: Date;
  uid: string;
  users: any[];
  userInfo: any;
}

interface Notification {
  type: string;
  linkId: string;
  users: any;
  dateCreation: Date;
  senderId: string;
  competitionName?: string;
  challIcon?: string;
}

interface User {
  activitesPratiquees: any[];
  avatar: string;
  friends: any[];
  niveau: number;
  sex: string;
  uid: string;
  userName: string;
}

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss'],
})
export class UserProfilComponent implements OnInit {
  @ViewChildren('hexagon') hexagon: QueryList<ElementRef>;
  @ViewChildren('points') points: QueryList<ElementRef>;
  @ViewChild('stat') stat: ElementRef;

  doneesIniitial = [
    {
      postion: {
        x: 30,
        y: 90,
      },
      vecteur: {
        x: -100,
        y: 50,
      },
    },
    {
      postion: {
        x: 140,
        y: 40,
      },
      vecteur: {
        x: 0,
        y: 110,
      },
    },
    {
      postion: {
        x: 230,
        y: 90,
      },
      vecteur: {
        x: 100,
        y: 50,
      },
    },
    {
      postion: {
        x: 230,
        y: 190,
      },
      vecteur: {
        x: 100,
        y: -50,
      },
    },
    {
      postion: {
        x: 130,
        y: 250,
      },
      vecteur: {
        x: 0,
        y: -110,
      },
    },
    {
      postion: {
        x: 30,
        y: 190,
      },
      vecteur: {
        x: -100,
        y: -50,
      },
    },
  ];

  ratio = [1, 0.8, 0.6, 0.4, 0.2];

  stats: any[] = [
    { name: 'Corps haut', stat: 800 },
    { name: 'Corps bas', stat: 500 },
    { name: 'Cardio', stat: 100 },
    { name: 'Explosivité', stat: 100 },
    { name: 'Souplesse', stat: 100 },
    { name: 'Gainage', stat: 200 },
  ];
  max: number;
  donneeFormat: any[] = [];
  seg: string = 'resume';
  statTable = [];
  position: string;
  @Input() userId: any;
  @Input() userInfo: any;
  currentUser: any;
  user: any;

  friendBool: boolean;

  constructor(
    public modalController: ModalController,
    public userService: UserService,
    public navController: NavController,
    public chatService: ChatService,
    public sessionNowService: SessionNowService,
    public navParams: NavParams,
    public alertController: AlertController,
    public notifService: NotificationService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.navParams.data.segment ? (this.seg = this.navParams.data.segment) : '';
    this.userId = this.navParams.data.userId;
    this.setUser();
  }

  async setUser() {
    this.currentUser = await this.userService.getCurrentUser();
    const userFind = await this.userService.findUser(this.userId);
    this.user = userFind.data();
    console.log(this.user);
    this.chatService.getUserRoom(this.userId);
    this.chatService.roomSubject$
      .pipe(
        tap((room: Message) => {
          console.log(room);
          this.user.friends.forEach((friend, i) => {
            console.log(friend, room);
            return room && room?.userInfo.uid == friend.uid
              ? (this.user.friends[i] = { ...friend, room: room })
              : friend;
          });
          console.log(this.user);
        })
      )
      .subscribe();

    const tableOrder = _.orderBy(this.user.metrics, ['value'], ['desc']);
    this.max = this.user.metrics ? Math.round(tableOrder[0].value * 1.2) : 0;
    this.friendBool = this.currentUser.friends?.some(
      (friend) => friend.uid == this.user.uid
    );
  }

  close(data?) {
    this.modalController.dismiss(data);
  }

  async openProfil(contact) {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: UserProfilComponent,
      componentProps: {
        userId: contact.uid,
        userInfo: contact,
      },
    });
    this.setUser();
    return await modal.present();
  }

  friendFind(friend) {
    return this.currentUser.friends.some((fr) => fr.uid == friend.uid);
  }

  addFriend(friend) {
    this.userService.addFriend(friend, this.currentUser);
    const notification: Notification = {
      type: `invitation amis`,
      linkId: this.currentUser.uid,
      users: [friend.uid],
      senderId: this.currentUser.uid,
      dateCreation: new Date(),
    };
    this.notifService.createNotifications(notification);

    this.friendBool = true;
    this.sessionNowService.show('Ajouté avec succès', 'success');
  }

  async removeFriend(contact) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention!',
      message:
        "Voulez-vous vraiment supprimer cet utilisateur de votre liste d'amis",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Confirmer',
          role: 'confirm',
          handler: () => {
            console.log('Confirm Okay');
          },
        },
      ],
    });
    alert.onDidDismiss().then((dat) => {
      if (dat.role == 'confirm') {
        this.userService.removeFriend(contact, this.currentUser);
        this.friendBool = false;
        this.setUser();
        this.sessionNowService.show("supprimer de la liste d'amis", 'warning');
      }
      console.log(dat);
    });
    await alert.present();
  }

  controlRoom(userContact): Promise<any> {
    return this.chatService.findRoom(this.currentUser.uid, userContact.uid);
  }

  async chat(userContact) {
    const check = await this.controlRoom(userContact);
    const roomId = check
      ? check.uid
      : await this.chatService.createRoom(this.currentUser, userContact);

    console.log(check, userContact);
    const modal = await this.modalController.create({
      component: ChatRoomComponent,
      // componentProps: {
      //   user: this.currentUser,
      //   contact: userContact,
      //   id: roomId,
      // },
      componentProps: {
        user: this.currentUser,
        contact: userContact,
        id: userContact.room?.uid,
        room: userContact.room,
      },
    });
    return await modal.present();
  }

  segmentChanged(ev) {
    this.seg = ev.detail.value;
  }
}
