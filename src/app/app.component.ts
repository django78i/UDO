import { Component } from '@angular/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
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
  }
}
