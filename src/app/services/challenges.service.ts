import { Injectable } from '@angular/core';
import { getAuth } from '@firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  db = getFirestore();
  challengeEnCours$: BehaviorSubject<any> = new BehaviorSubject(null);
  challenges$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {}

  async createChallenge(chall) {
    console.log(chall);
    const id = this.createId();
    chall = { ...chall, uid: id };
    await setDoc(doc(this.db, 'challenges', chall.uid), chall);
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
    return guid();
  }

  getChallenges() {
    const auth = getAuth();
    auth.currentUser.uid;

    const docRef = query(collection(this.db, 'challenges'));
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      const users = JSON.parse(localStorage.getItem('usersList'));
      querySnapshot.docChanges().forEach((changes) => {
        if (changes) {
          this.challengeEnCours$.next(null);
          this.challenges$.next(null);
        }
      });
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        const bool = document.participants.some(
          (users: any) => users.uid == auth.currentUser.uid
        );
        const docFormat = this.formatChamp(document, users);
        console.log(docFormat);
        if (document.status == 'en cours' && bool) {
          this.challengeEnCours$.next(docFormat);
        } else if (document.status == 'en attente') {
          this.challenges$.next(docFormat);
        }
        // else if (
        //   document.status == 'en attente' &&
        //   bool &&
        //   document.type == 'Network'
        // ) {
        //   this.champNetWork$.next(docFormat);
        // }
      });
    });
  }

  formatChamp(chall, users) {
    const challenge = chall;
    challenge.participants = challenge.participants.map((participant) => {
      const partFormat = users?.find((user) => participant.uid == user.uid);
      return { ...participant, user: partFormat };
    });
    return challenge;
  }
}
