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
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user-service.service';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import * as _ from 'lodash';
import { SessionNowService } from 'src/app/services/session-now-service.service';

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
  @Input() currentUser: User;
  user: any;

  friendBool: boolean;

  constructor(
    public modalController: ModalController,
    public userService: UserService,
    public navController: NavController,
    public chatService: ChatService,
    public sessionNowService: SessionNowService,
    public navParams: NavParams
  ) {}

  ngOnInit() {
    this.navParams.data.segment ? (this.seg = this.navParams.data.segment) : '';
    console.log(this.userId);
    this.userService.findUser(this.userId).then((user) => {
      this.user = user.data();

      const tableOrder = _.orderBy(this.user.metrics, ['value'], ['desc']);
      console.log(tableOrder);
      this.max = this.user.metrics ? Math.round(tableOrder[0].value * 1.2) : 0;
      console.log(this.max);
      // this.createGraph();
      // this.position = this.createStats();
      console.log(this.currentUser, this.user);
      this.friendBool = this.currentUser.friends?.some(
        (friend) => friend.uid == this.user.uid
      );
      console.log(this.friendBool);
    });
  }

  // ngAfterViewInit() {
  //   console.log(this.user);
  //   this.hexagon.map((hex, indice) => {
  //     const position = `${this.donneeFormat[indice][0].x},${this.donneeFormat[indice][0].y} ${this.donneeFormat[indice][1].x},${this.donneeFormat[indice][1].y} ${this.donneeFormat[indice][2].x},${this.donneeFormat[indice][2].y} ${this.donneeFormat[indice][3].x},${this.donneeFormat[indice][3].y} ${this.donneeFormat[indice][4].x},${this.donneeFormat[indice][4].y} ${this.donneeFormat[indice][5].x},${this.donneeFormat[indice][5].y}`;
  //     hex.nativeElement.setAttribute('points', position);
  //     indice == 0
  //       ? (hex.nativeElement.style.strokeWidth = '2px')
  //       : (hex.nativeElement.style.strokeWidth = '1px');
  //   });
  //   this.points.map((hex, indice) => {
  //     hex.nativeElement.setAttribute('cx', this.statTable[indice].position.x);
  //     hex.nativeElement.setAttribute('cy', this.statTable[indice].position.y);
  //   });
  //   this.stat.nativeElement.setAttribute('points', this.position);
  // }

  close(data?) {
    this.modalController.dismiss(data);
  }

  createStats() {
    let table: any[] = [];
    if (this.user.metrics) {
      this.user.metrics.map((stat, i) => {
        const ratio = stat.value / this.max;
        console.log(this.ratio, this.max, stat.value);
        const position = {
          x: 130 - this.doneesIniitial[i].vecteur.x * ratio,
          y: 130 - this.doneesIniitial[i].vecteur.y * ratio,
        };
        this.statTable.push({
          name: stat.name,
          ratio: ratio * 100,
          position: position,
        });
      });
    } else {
      const table: any[] = [
        {
          name: 'corps haut',
          value: 0,
          ratio: 0,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'corps bas',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'souplesse',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'explosivité',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'cardio',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
        {
          name: 'gainage',
          value: 130,
          ratio: 130,
          position: {
            x: 130,
            y: 130,
          },
        },
      ];
      this.statTable = table;
    }
    let position;
    return (position = `${this.statTable[0].position.x},${this.statTable[0].position.y} ${this.statTable[1].position.x},${this.statTable[1].position.y} ${this.statTable[2].position.x},${this.statTable[2].position.y} ${this.statTable[3].position.x},${this.statTable[3].position.y} ${this.statTable[4].position.x},${this.statTable[4].position.y} ${this.statTable[5].position.x},${this.statTable[5].position.y}`);
  }

  createGraph() {
    this.ratio.map((ratio) => {
      const format = this.doneesIniitial.map((vecteur) => {
        const ratioVecteur = {
          x: vecteur.vecteur.x * ratio,
          y: ratio * vecteur.vecteur.y,
        };
        const svgPos = {
          x: 130 - ratioVecteur.x,
          y: 130 - ratioVecteur.y,
        };
        return svgPos;
      });
      this.donneeFormat.push(format);
    });
  }

  addFriend() {
    this.userService.addFriend(this.user, this.currentUser);
    this.friendBool = true;
    this.sessionNowService.show('Ajouté avec succès', 'success');
  }

  removeFriend() {
    this.userService.removeFriend(this.user, this.currentUser);
    this.friendBool = false;
    this.sessionNowService.show('supprimer des amis', 'warning');
  }

  controlRoom(): Promise<any> {
    return this.chatService.findRoom(this.currentUser.uid, this.user.uid);
  }

  async chat() {
    const check = await this.controlRoom();
    const roomId = check
      ? check.uid
      : await this.chatService.createRoom(this.currentUser, this.user);

    console.log(check);
    const modal = await this.modalController.create({
      component: ChatRoomComponent,
      componentProps: {
        user: this.currentUser,
        contact: this.user,
        id: roomId,
      },
    });
    return await modal.present();
  }

  segmentChanged(ev) {
    console.log(ev);
    this.seg = ev.detail.value;
    console.log(this.seg);
  }
}
