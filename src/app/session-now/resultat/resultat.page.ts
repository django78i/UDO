import { Component, OnInit } from '@angular/core';
import { AddContenuComponent } from '../add-contenu/add-contenu.component';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DonneesPriveComponent } from '../donnees-prive/donnees-prive.component';
import { Location } from '@angular/common';
import { SessionNowModel } from '../demarrage/demarrage.page';
import moment from 'moment';

@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.page.html',
  styleUrls: ['./resultat.page.scss'],
})
export class ResultatPage implements OnInit {
  sessionNow: SessionNowModel;
  activite: any;
  listElement: any;
  now;
  isPicture = true;
  commentaire = '';
  base64: any;
  counter: any;
  listReactions = [];
  dateSession: any;
  listNotif: any = [
    { img: 'assets/images/personn.png', nombre: '70', name: 'Bernard', comment: 'Lorem ipsum dolor sit atmet', date: 'Il y a 1 min.', icon: 'assets/images/Blush.png' },
    { img: 'assets/images/personn2.PNG', nombre: '10', name: 'Mélanie', comment: 'Lorem ipsum dolor sit atmet', date: 'Il y a 1 min.', icon: 'assets/images/ThumbsUp.png' },
  ];
  constructor(private modalCtrl: ModalController,
    private platform: Platform,
    private _location: Location) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this._location.back();
    });
    if (localStorage.getItem('picture')) {
      this.base64 = localStorage.getItem('picture');
    }
    this.counter = JSON.parse(localStorage.getItem('counter'));
    let sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    if (sessionNow) {
      let list = sessionNow.reactions;
      let currentSeconds,currentMinutes,currentHeures;
      currentSeconds = moment().diff(sessionNow.startDate, 'seconds');
      currentMinutes = moment().diff(sessionNow.startDate, 'minutes');
      currentHeures = moment().diff(sessionNow.startDate, 'hours');
      if(currentSeconds>60){
        if(currentMinutes>60){
          this.dateSession = 'il ya ' + currentHeures + ' heures';
        }else{
          this.dateSession = 'il ya ' + currentMinutes + ' minutes';
        }
      }else{
        this.dateSession = 'il ya ' + currentSeconds + ' secondes';
      }
      // if (currentDate > 60) {
      //   currentDate = moment().diff(sessionNow.startDate, 'hours');
      //   if (currentDate > 60) {
      //     currentDate = moment().diff(sessionNow.startDate, 'days');
      //     this.dateSession = 'il ya ' + currentDate + ' jours';
      //   } else {
      //     this.dateSession = 'il ya ' + currentDate + ' heures';
      //   }
      // } else {
      //   if (currentDate < 60) {
      //     currentDate = moment().diff(sessionNow.startDate, 'seconds');
      //     this.dateSession = 'il ya ' + currentDate + ' secondes';
      //   }
      //   else {
      //     this.dateSession = 'il ya ' + currentDate + ' minutes';
      //   }
      // }
      if(list.length!=0){
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
          if (date < 60) {
            currentValue = 'il ya ' + date + ' secondes';
          }
          else {
            currentValue = 'il ya ' + date + ' minutes';
          }
        }
        let value = {
          icon: "assets/images/" + val.mapValue.fields.reactionType.stringValue,
          commentaire: val.mapValue.fields.commentaire.stringValue,
          username: val.mapValue.fields.username.stringValue,
          img: 'assets/images/personn.png',
          date: currentValue

        }
        this.listReactions.push(value);

      }}

    }
  }

  ngOnInit() {
    this.activite = JSON.parse(localStorage.getItem('activite'));
    this.listElement = JSON.parse(localStorage.getItem('choix'));

    this.sessionNow = JSON.parse(localStorage.getItem('sessionNow'));
    if (this.sessionNow) {
      this.sessionNow.reactionNumber = this.listNotif?.length;
      //if (this.isPicture)
      // this.sessionNow.photo=this.
      // this.activite = item;
    }
  }

  publier() {
    if (this.isPicture) {
      this.donneesPrive();
    } else {
      this.addContenu();
    }
  }

  async addContenu() {
    const modal = await this.modalCtrl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
      this.base64 = data.data;
    });
    return await modal.present();

  }
  async donneesPrive() {
    localStorage.setItem('sessionNow', JSON.stringify(this.sessionNow));
    const modal = await this.modalCtrl.create({
      component: DonneesPriveComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {

    });
    return await modal.present();

  }


}
