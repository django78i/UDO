import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
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
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChampionnatsService {
  champSubject$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {}

  async createChampionnat(champ) {
    const db = getFirestore();
    const id = this.createId();
    champ = { ...champ, uid: id };
    await setDoc(doc(db, 'championnats', champ.uid), champ);
  }

  async getChampionnats() {
    const db = getFirestore();
    const docRef = query(collection(db, `championnats`));
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.forEach((doc) => {
        console.log(doc);
        champs.push(doc.data());
      });
      this.champSubject$.next(champs);
      console.log('Current cities in CA: ', champs);
    });
  }

  createId() {
    let guid = () => {
      let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
      //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
      return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    };
    console.log(guid());
    return guid();
  }
}
