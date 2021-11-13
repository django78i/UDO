import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import * as firebase from 'firebase/app';
import { UserService } from './services/user-service.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private screenOrientation: ScreenOrientation,
  ) {
    const config = {
      apiKey: 'AIzaSyCHrlvzztARn_AUL9yiVTTEtGSMdgO_XRw',
      authDomain: 'udonew-cc142.firebaseapp.com',
      projectId: 'udonew-cc142',
      storageBucket: 'udonew-cc142.appspot.com',
      messagingSenderId: '911285735248',
      appId: '1:911285735248:web:f712b9386ccd86156a6655',
      measurementId: 'G-KK1ZNG7DR0',
    };
    firebase.initializeApp(config);


    let value = localStorage.getItem('reglages');
    if (value) {
      let listReglages = JSON.parse(value);
      if (listReglages.son) {
        this.setLandscape();
      } else {
        this.setPortrait();
      }
    }
  }


  setLandscape() {
    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  setPortrait() {
    // set to portrait
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
}

