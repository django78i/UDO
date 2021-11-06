import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import * as firebase from 'firebase/app';

const config = {
  apiKey: 'AIzaSyCHrlvzztARn_AUL9yiVTTEtGSMdgO_XRw',
  authDomain: 'udonew-cc142.firebaseapp.com',
  projectId: 'udonew-cc142',
  storageBucket: 'udonew-cc142.appspot.com',
  messagingSenderId: '911285735248',
  appId: '1:911285735248:web:f712b9386ccd86156a6655',
  measurementId: 'G-KK1ZNG7DR0',
};
const app=firebase.initializeApp(config);

function whichAuth() {
  let auth ;
  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    });
  } else {
    auth = getAuth();
  }
  return auth;
}

export const auth = whichAuth();
