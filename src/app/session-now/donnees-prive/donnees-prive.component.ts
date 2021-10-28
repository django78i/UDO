import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import {SessionNowService} from "../../services/session-now-service.service";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-donnees-prive',
  templateUrl: './donnees-prive.component.html',
  styleUrls: ['./donnees-prive.component.scss'],
})
export class DonneesPriveComponent implements OnInit {
  image: any;

  constructor(private modalCtr:ModalController,
    private router:Router,
    private snService:SessionNowService,
    private localNotifications: LocalNotifications) { 
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
      this.snService.update(sessionNow,'session-now');
    }

    this.close();
    this.router.navigate(['session-now/felicitation']);
  }
}
