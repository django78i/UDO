import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  listNotif:any = [
    {img:"assets/images/personn.png",nombre:"70",name:"Bernard",comment:"Lorem ipsum dolor sit atmet",date:"Il y a 1 min.",icon:"assets/images/Blush.png"},
    {img:"assets/images/personn2.PNG",nombre:"10",name:"Mélanie",comment:"Lorem ipsum dolor sit atmet",date:"Il y a 1 min.",icon:"assets/images/ThumbsUp.png"},
  ];
  counter:any;
  constructor(private modalCtr:ModalController) {
    this.counter = JSON.parse(localStorage.getItem('counter'));
   }

  ngOnInit() {
  }
  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }
} 
