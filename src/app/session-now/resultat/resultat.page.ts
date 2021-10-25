import { Component, OnInit } from '@angular/core';
import { AddContenuComponent } from '../add-contenu/add-contenu.component';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DonneesPriveComponent } from '../donnees-prive/donnees-prive.component';
import { Location } from '@angular/common';
import { SessionNowModel } from '../demarrage/demarrage.page';

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
  listNotif: any = [
    { img: 'assets/images/personn.png', nombre: '70', name: 'Bernard', comment: 'Lorem ipsum dolor sit atmet', date: 'Il y a 1 min.', icon: 'assets/images/Blush.png' },
    { img: 'assets/images/personn2.PNG', nombre: '10', name: 'Mélanie', comment: 'Lorem ipsum dolor sit atmet', date: 'Il y a 1 min.', icon: 'assets/images/ThumbsUp.png' },
  ];
  constructor(private modalCtrl: ModalController,
    private router: Router,
    private platform: Platform,
    private _location: Location) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this._location.back();
    });

    this.counter = JSON.parse(localStorage.getItem('counter'));
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
