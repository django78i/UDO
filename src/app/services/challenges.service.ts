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
  Unsubscribe,
  limit,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  db = getFirestore();
  challengeEnCours$: BehaviorSubject<any> = new BehaviorSubject(null);
  challenges$: BehaviorSubject<any> = new BehaviorSubject(null);
  singleChallSub$: BehaviorSubject<any> = new BehaviorSubject(null);
  challengesList$: BehaviorSubject<any> = new BehaviorSubject(null);
  unsubscribe: Unsubscribe;

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

  async getChallenge(uid) {
    const users = JSON.parse(localStorage.getItem('usersList'));
    const docData = await getDoc(doc(this.db, 'challenges', uid));
    const dataDoc = await docData.data();
    const champ = this.formatChall(dataDoc, users);
    console.log(champ);
    this.singleChallSub$.next(champ);
  }

  async getChallengesList() {
    this.challengesList$ = new BehaviorSubject(null);

    const docRef = query(collection(this.db, 'challenges'), limit(15));
    const documentSnapshots = await getDocs(docRef);
    let table = [];
    documentSnapshots.forEach((doc) => {
      if (doc) {
        console.log(doc.data());
        this.challengesList$.next(doc.data());
        // table.push(doc.data());
      }
    });
    console.log(table);
  }

  getChallenges() {
    const auth = getAuth();
    auth.currentUser.uid;

    const docRef = collection(this.db, 'challenges');
    this.unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const users = JSON.parse(localStorage.getItem('usersList'));
      querySnapshot.docChanges().forEach((changes) => {
        if (changes) {
          console.log('ici', changes);
          this.challengeEnCours$.next(null);
          this.challenges$.next(null);
        }
      });
      querySnapshot.forEach((doc) => {
        if (document) {
          const document = doc.data();
          const bool = document.participants.some(
            (users: any) => users.uid == auth.currentUser.uid
          );
          const docFormat = this.formatChall(document, users);
          console.log(docFormat);
          if (document.status == 'en cours' && bool) {
            this.challengeEnCours$.next(docFormat);
          } else if (document.status == 'en attente') {
            this.challenges$.next(docFormat);
          }
        }
      });
    });
  }

  async updateChall(chall) {
    await updateDoc(doc(this.db, 'challenges', chall.uid), chall);
  }

  formatChall(chall, users) {
    const challenge = chall;
    challenge.participants = challenge.participants.map((participant) => {
      const partFormat = users?.find((user) => participant.uid == user.uid);
      return { ...participant, user: partFormat };
    });
    return challenge;
  }
}
