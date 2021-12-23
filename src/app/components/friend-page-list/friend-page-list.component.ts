import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ChallengesService } from 'src/app/services/challenges.service';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SessionNowService } from 'src/app/services/session-now-service.service';

interface Notification {
  type: string;
  linkId: string;
  users: any;
  dateCreation: Date;
  senderId: string;
  competitionName?: string;
  challIcon?: string;
}

@Component({
  selector: 'app-friend-page-list',
  templateUrl: './friend-page-list.component.html',
  styleUrls: ['./friend-page-list.component.scss'],
})
export class FriendPageListComponent implements OnInit {
  @Input() championnat: any;
  @Input() type: any;
  @Input() challIcon: string;
  friendsList: any[];

  constructor(
    public modalController: ModalController,
    public navParm: NavParams,
    public champService: ChampionnatsService,
    public sessionNowService: SessionNowService,
    public challService: ChallengesService,
    public notifService: NotificationService
  ) {}

  ngOnInit() {
    this.championnat = this.navParm.data.competition;
    console.log(this.championnat);
  }

  close(ev) {
    this.modalController.dismiss(ev);
  }

  chooseFriends(event) {
    this.friendsList = event;
  }

  sendInvite() {
    console.log(this.friendsList);
    let participantsToNotify = [];

    this.friendsList.forEach((friend) => {
      const exist = this.championnat.participants.some(
        (part) => part.uid == friend.uid
      );

      //l'utilisateur peut être ajouté à la liste des participants
      if (!exist) {
        let competValue;
        //initialisation participant
        if (this.type == 'championnat') {
          competValue = {
            bonus: 0,
            journeeEnCours: 0,
            points: 0,
          };
        } else {
          competValue = {
            seance: 0,
            value: 0,
          };
        }
        friend = { ...friend, ...competValue };
        participantsToNotify.push(friend.uid);
        this.championnat.participants.push(friend);
      }
      console.log(exist);
    });
    console.log(participantsToNotify);
    const notification: Notification = {
      dateCreation: new Date(),
      competitionName: this.championnat.name,
      type:
        this.type == 'championnat'
          ? `invitation championnat ${this.championnat.type}`
          : 'invitation challenge',
      linkId: this.championnat.uid,
      users: participantsToNotify,
      challIcon: this.challIcon ? this.challIcon : '',
      senderId:
        this.type == 'championnat' ? this.championnat.createur.uid : 'UDO',
    };
    this.notifService.createNotifications(notification);

    console.log(this.championnat, this.type);
    if (this.type == 'championnat') {
      this.champService
        .updateChamp(this.championnat)
        .then(() => this.sessionNowService.show('Invitation enoyé', 'success'))
        .catch((err) => {
          console.log(err);
          this.sessionNowService.show(
            'Inivitation non envoyé, veuillez rééssayer plus tard',
            'warning'
          );
        });
    } else {
      this.challService
        .updateChall(this.championnat)
        .then(() => this.sessionNowService.show('Invitation enoyé', 'success'))
        .catch((err) =>
          this.sessionNowService.show(
            'Inivitation non envoyé, veuillez rééssayer plus tard',
            'warning'
          )
        );
    }
    this.close(this.championnat);
  }
}
