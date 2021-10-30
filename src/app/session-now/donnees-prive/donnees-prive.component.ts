import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import {SessionNowService} from "../../services/session-now-service.service";
import moment from 'moment';

@Component({
  selector: 'app-donnees-prive',
  templateUrl: './donnees-prive.component.html',
  styleUrls: ['./donnees-prive.component.scss'],
})
export class DonneesPriveComponent implements OnInit {
  image: any;

  constructor(private modalCtr:ModalController,private router:Router,private snService:SessionNowService) { 
    this.image = JSON.parse(localStorage.getItem('image'));
  }

  ngOnInit() {}

  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }
  publier(){
    const sessionNow=JSON.parse(localStorage.getItem('sessionNow'));
    console.log(sessionNow);
    if(sessionNow){
      let posted = localStorage.getItem('posted');
      if(posted || posted == 'false'){
        if(this.image){
          let postModel = {
            postedAt: moment().format('DD/MM/YYYY'),
            postedBy: '',
            sessionUUID: sessionNow.uid,
            picture: this.image ? this.image.path : ''
          }
          this.snService.create(postModel, 'post-session-now')
            .then(res => {
              localStorage.setItem('posted',''+true);
            })
        }
      }
      this.snService.update(sessionNow,'session-now');

    }

    this.close();
    this.router.navigate(['session-now/felicitation']);
  }
}
