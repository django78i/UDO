import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  counter: any;
  reaction;
  listReactions = [];
  constructor(private modalCtr: ModalController) {
    this.counter = JSON.parse(localStorage.getItem('counter'));
    let sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    if (sessionNow) {
      this.reaction = sessionNow.reactions.length;
      let list = sessionNow.reactions;
      if (this.reaction > 0) {
        for (let val of list) {
          let currentValue;
          let date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'minutes');
          if (date > 60) {
            date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'hours');
            if (date > 60) {
              date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'days');
              currentValue = 'il ya ' + date + ' jours';
            } else {
              currentValue = 'il ya ' + date + ' heures';
            }
          } else {
            currentValue = 'il ya ' + date + ' minutes';
          }
          let value = {
            icon: "assets/images/" + val.mapValue.fields.reactionType.stringValue,
            commentaire: val.mapValue.fields.commentaire.stringValue,
            username: val.mapValue.fields.username.stringValue,
            img: 'assets/images/personn.png',
            date: currentValue

          }
          this.listReactions.push(value);

        }
      }
      console.log("reactions", this.listReactions);

    }
  }

  ngOnInit() {
  }
  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }
}
