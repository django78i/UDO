import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ChallengesService } from 'src/app/services/challenges.service';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { SessionNowService } from 'src/app/services/session-now-service.service';

@Component({
  selector: 'app-friend-page-list',
  templateUrl: './friend-page-list.component.html',
  styleUrls: ['./friend-page-list.component.scss'],
})
export class FriendPageListComponent implements OnInit {
  @Input() championnat: any;
  @Input() type: any;
  friendsList: any[];

  constructor(
    public modalController: ModalController,
    public navParm: NavParams,
    public champService: ChampionnatsService,
    public sessionNowService: SessionNowService,
    public challService: ChallengesService
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
    this.friendsList.forEach((friend) => {
      this.championnat.participants.push(friend);
    });
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
