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
  mode = "";
  modeClasse = "";
  constructor(private modalCtr: ModalController) {
    setInterval(() => {
      if (localStorage.getItem('mode')) {
        if (localStorage.getItem('mode') == 'landscape') {
          this.mode = 'landscape';
          this.modeClasse = "c-text-lands";
        } else {
          this.mode = 'portrait';
          this.modeClasse = "c-text";
        }
      } else {
        this.modeClasse = "c-text";
      }
    }, 100);
    this.counter = JSON.parse(localStorage.getItem('counter'));
    let sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    if (sessionNow) {
      this.reaction = sessionNow.reactions.length;
      let list = sessionNow.reactions;
      if (this.reaction > 0) {
        for (let val of list) {
          let currentValue;
          let date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'seconds');
          if (date > 60) {
            date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'minutes');
            if (date > 60) {
              date = moment(val.mapValue.fields.date.stringValue).diff(moment(), 'hours');
              currentValue = "Il y'a " + date + " heures";
            } else {
              currentValue = "Il y'a " + date + " minutes";
            }
          } else {
            currentValue = "Il y'a moins d'1 min";
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
      } else {
        this.listReactions = [];
      }

    }
  }

  ngOnInit() {
  }
  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }
}
