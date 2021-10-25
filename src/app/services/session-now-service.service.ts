import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import firebase from 'firebase/app';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root',
})
export class SessionNowService {
  constructor(
    private googlePlus: GooglePlus,
    public platform: Platform, // private googlePlus: GooglePlus,
    public alertController: AlertController
  ) {}


  async create(document,collectionName) {
    const db = getFirestore();
    const id = this.createId();
    document = { ...document, uid: id };
    await setDoc(doc(db, collectionName, document.uid), document);
    return id;
  }
  createId() {
    const guid = () => {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
      return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    };
    return guid();
  }


  async getCurrentUser(): Promise<DocumentData> {
    const auth = getAuth();
    const user = await auth.currentUser;
    const userDataBase = await this.find(user.uid,'users');
    return userDataBase.data();
  }

  async find(uuid,collectionName): Promise<DocumentSnapshot<DocumentData>> {
    const db = getFirestore();
    const document = await getDoc(doc(db, collectionName, uuid));
    return document;
  }

  async update(document,collectionName) {
    const db = getFirestore();
    await updateDoc(doc(db, collectionName, document.uid), document);
  }


}
