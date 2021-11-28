import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { SessionNowService } from 'src/app/services/session-now-service.service';

@Component({
  selector: 'app-friend-page-list',
  templateUrl: './friend-page-list.component.html',
  styleUrls: ['./friend-page-list.component.scss'],
})
export class FriendPageListComponent implements OnInit {
  @Input() championnat: any;
  friendsList: any[];

  constructor(
    public modalController: ModalController,
    public navParm: NavParams,
    public champService: ChampionnatsService,
    public sessionNowService: SessionNowService
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
    this.friendsList.forEach((friend) => {
      this.championnat.participants.push(friend);
    });
    console.log(this.championnat);
    this.champService.updateChamp(this.championnat);
    this.sessionNowService.show('Invitation enoyé', 'success');
    this.close(this.championnat);
  }
}
