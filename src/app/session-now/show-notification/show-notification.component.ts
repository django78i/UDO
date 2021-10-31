import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import moment from 'moment';

@Component({
  selector: 'app-show-notification',
  templateUrl: './show-notification.component.html',
  styleUrls: ['./show-notification.component.scss'],
})
export class ShowNotificationComponent implements OnInit {

  item ;
  constructor(private modalCtr:ModalController, private navParams: NavParams,) {
    
    let val =  this.navParams.data.data;
    let currentDate= val.mapValue.fields.date.stringValue;
    let currentValue;

    let date = moment().diff(moment(), 'seconds');
   if(date>60){
     date = moment(currentDate).diff(moment(), 'minutes');
    if(date>60){
      date = moment(currentDate).diff(moment(), 'hours');
      currentValue ="Il y'a "+date+" heures";
    }else{
      currentValue ="Il y'a "+date+" minutes";
    }
    }else{
     currentValue = "Il y'a moins d'1 min";
   }
    this.item= {
      icon: "assets/images/" + val.mapValue.fields.reactionType.stringValue,
      commentaire: val.mapValue.fields.commentaire.stringValue,
      username: val.mapValue.fields.username.stringValue,
      img: 'assets/images/personn.png',
      date: currentValue
  
    }
  setTimeout(() => {
    this.close();
  }, 10000);
   }

  ngOnInit() {}

  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

}
