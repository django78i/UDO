import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivitiesPage } from '../activities/activities.page';
import { AidePage } from '../aide/aide.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reglages',
  templateUrl: './reglages.page.html',
  styleUrls: ['./reglages.page.scss'],
})
export class ReglagesPage implements OnInit {
  listReglages :any = [];
  value:any;
  children=[{image:"assets/images/icon1.PNG",name:"Power lifting"},{image:"assets/images/icon2.PNG",name:"Bench press"},{image:"assets/images/icon3.PNG",name:"Abdominaux"},{image:"assets/images/icon4.PNG",name:"Cordes"},{image:"assets/images/icon5.PNG",name:"Souplesse"},{image:"assets/images/icon6.PNG",name:"Vélo elliptique"}];
  constructor(private modalCtr:ModalController,private router:Router) { }
  ngOnInit() {
    this.listReglages=[{id:1,image:"assets/images/icon10.PNG", name:'Tapis de course',desc:"Type d'activité",children:[{image:"assets/images/icon1.PNG",name:"Power lifting"},{image:"assets/images/icon2.PNG",name:"Bench press"},{image:"assets/images/icon3.PNG",name:"Abdominaux"},{image:"assets/images/icon4.PNG",name:"Cordes"},{image:"assets/images/icon5.PNG",name:"Souplesse"},{image:"assets/images/icon6.PNG",name:"Vélo elliptique"}]},{id:2,image:"assets/images/icon8.PNG",name:'Rotation automatique',desc:"Réarrangement automatique de l'interface",children:[]},{id:3,image:"assets/images/icon9.PNG",name:"Carte",desc:"Afficher votre position GPS",children:[{image:"assets/images/icon1.PNG",name:"Power lifting"},{image:"assets/images/icon2.PNG",name:"Bench press"},{image:"assets/images/icon3.PNG",name:"Abdominaux"},{image:"assets/images/icon4.PNG",name:"Cordes"},{image:"assets/images/icon5.PNG",name:"Souplesse"},{image:"assets/images/icon6.PNG",name:"Vélo elliptique"}]}]
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
    this.router.navigate(['aide']);
  }


  async choisirActivite() {
    const modal = await this.modalCtr.create({
      component: ActivitiesPage,
      cssClass: 'my-custom-activite-modal',
      componentProps: {

      }
    });
    modal.onDidDismiss().then((data: any) => {

    });
    return await modal.present();

  }
}
