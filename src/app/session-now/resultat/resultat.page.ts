import { Component, OnInit } from '@angular/core';
import { AddContenuComponent } from '../add-contenu/add-contenu.component';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router } from '@angular/router';
import { DonneesPriveComponent } from '../donnees-prive/donnees-prive.component';

@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.page.html',
  styleUrls: ['./resultat.page.scss'],
})
export class ResultatPage implements OnInit {
  activite: any;
  listElement: any;
  now;
  isPicture: boolean = true;
  commentaire = "";
  base64: any;
  counter: any;
  listNotif: any = [
    { img: "assets/images/personn.png", nombre: "70", name: "Bernard", comment: "Lorem ipsum dolor sit atmet", date: "Il y a 1 min.", icon: "assets/images/Blush.png" },
    { img: "assets/images/personn2.PNG", nombre: "10", name: "Mélanie", comment: "Lorem ipsum dolor sit atmet", date: "Il y a 1 min.", icon: "assets/images/ThumbsUp.png" },
  ]
  constructor(private modalCtrl: ModalController, private router: Router) {
    this.counter = JSON.parse(localStorage.getItem('counter'));
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4].slice(0, 5);
    }, 1);
  }

  ngOnInit() {
    this.activite = JSON.parse(localStorage.getItem('activite'));
    this.listElement = JSON.parse(localStorage.getItem('choix'));
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
    const modal = await this.modalCtrl.create({
      component: DonneesPriveComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {

    });
    return await modal.present();

  }

  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.base64 = theActualPicture;
    console.log('image', this.base64);


  }
}
