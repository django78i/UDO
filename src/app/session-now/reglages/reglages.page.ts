import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-reglages',
  templateUrl: './reglages.page.html',
  styleUrls: ['./reglages.page.scss'],
})
export class ReglagesPage implements OnInit {
  listReglages: any;
  value: any;
  counter: any;
  children = [{ image: "assets/images/icon1.PNG", name: "Power lifting" }, { image: "assets/images/icon2.PNG", name: "Bench press" }, { image: "assets/images/icon3.PNG", name: "Abdominaux" }, { image: "assets/images/icon4.PNG", name: "Cordes" }, { image: "assets/images/icon5.PNG", name: "Souplesse" }, { image: "assets/images/icon6.PNG", name: "Vélo elliptique" }];
  constructor(private modalCtr: ModalController, private router: Router, private screenOrientation: ScreenOrientation) {
    this.counter = JSON.parse(localStorage.getItem('counter'));

  }
  ngOnInit() {
    this.listReglages = { rotation: false, son: false, compteRebour: false, modePrive: false };
    let value = localStorage.getItem('reglages');
    if (value) {
      this.listReglages = JSON.parse(value);
      if (this.listReglages.son) {
        this.setLandscape();
      } else {
        this.setPortrait();
      }

    }
  }

  iconWork(id: string) {
    let icon1 = document.getElementById(id);
    icon1.style.display = "none";

    let icon2 = document.getElementById(id + 'icon2');
    icon2.style.display = "block";
    this.value = id + 'icon2';

  }

  revIconWork(id: string) {
    let icon1 = document.getElementById(id);
    icon1.style.display = "block";

    let icon2 = document.getElementById(id + 'icon2');
    icon2.style.display = "none";
    this.value = id;

  }

  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

  information() {
    this.close();
    this.router.navigate(['session-now/help']);
  }

  checkReglage(evt, type) {
    this.listReglages[type] = evt.detail.checked;
    localStorage.setItem('reglages', JSON.stringify(this.listReglages));
    if (type == 'son') {
      if (evt.detail.checked) {
        this.setLandscape();
      } else {
        this.setPortrait();
      }
    }
  }
  setLandscape() {
    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    localStorage.setItem('mode','landscape');
  }

  setPortrait() {
    // set to portrait
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    localStorage.setItem('mode','portrait');
  }

}
