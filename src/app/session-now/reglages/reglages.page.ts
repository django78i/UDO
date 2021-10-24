import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AidePage } from '../aide/aide.page';
import { Router } from '@angular/router';
import { ActivitiesPage } from '../activities/activities.page';

@Component({
  selector: 'app-reglages',
  templateUrl: './reglages.page.html',
  styleUrls: ['./reglages.page.scss'],
})
export class ReglagesPage implements OnInit {
  listReglages :any;
  value:any;
  children=[{image:"assets/images/icon1.PNG",name:"Power lifting"},{image:"assets/images/icon2.PNG",name:"Bench press"},{image:"assets/images/icon3.PNG",name:"Abdominaux"},{image:"assets/images/icon4.PNG",name:"Cordes"},{image:"assets/images/icon5.PNG",name:"Souplesse"},{image:"assets/images/icon6.PNG",name:"Vélo elliptique"}];
  constructor(private modalCtr:ModalController,private router:Router) { }
  ngOnInit() {
    this.listReglages={verrouillage:false,rotation:false,carte:false,son:false,compteRebour:false,modePrive:false};
    let value = localStorage.getItem('reglages');
    if(value){
      this.listReglages = JSON.parse(value);
    }
  }

  iconWork(id: string ){
    let icon1 = document.getElementById(id);
    icon1.style.display = "none";

    let icon2 = document.getElementById(id+'icon2');
    icon2.style.display = "block";
    this.value = id+'icon2';
    
  }

  revIconWork(id: string ){
    let icon1 = document.getElementById(id);
    icon1.style.display = "block";

    let icon2 = document.getElementById(id+'icon2');
    icon2.style.display = "none";
    this.value=id;

  }

  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

  information() {
    this.close();
    this.router.navigate(['session-now/help']);
  }

  checkReglage(evt,type){ 
    this.listReglages[type] = evt.detail.checked;
    localStorage.setItem('reglages',JSON.stringify(this.listReglages));
  }

}
