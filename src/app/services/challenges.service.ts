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
  startAfter,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification-service.service';

interface Notification {
  type: string;
  linkId: string;
  users: any;
  dateCreation: Date;
  senderId: string;
  competitionName?: string;
  challIcon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  db = getFirestore();
  challengeEnCours$: BehaviorSubject<any> = new BehaviorSubject(null);
  challenges$: BehaviorSubject<any> = new BehaviorSubject(null);
  singleChallSub$: BehaviorSubject<any> = new BehaviorSubject(null);
  challengesList$: BehaviorSubject<any> = new BehaviorSubject(null);
  challengeUser$: BehaviorSubject<any> = new BehaviorSubject(null);
  challengeTermines$: BehaviorSubject<any> = new BehaviorSubject(null);
  unsubscribe: Unsubscribe;

  constructor(public notificationService: NotificationService) {}

  async createChallenge(chall) {
    const auth = getAuth();
    console.log(chall);
    const id = this.createId();
    chall = { ...chall, uid: id };

    //utilisateurs à notifier
    const participantsToNotify = chall.participants
      .filter((part) => auth.currentUser.uid != part.uid)
      .map((part) => part.uid);

    const notification: Notification = {
      type: `invitation championnat ${chall.type}`,
      competitionName: chall.name,
      linkId: chall.uid,
      users: participantsToNotify,
      senderId: chall.createur.uid,
      dateCreation: new Date(),
    };
    this.notificationService.createNotifications(notification);

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

    const docRef = query(
      collection(this.db, 'challenges'),
      orderBy('dateCreation', 'desc'),
      limit(15)
    );
    const documentSnapshots = await getDocs(docRef);
    let table = [];
    documentSnapshots.forEach((doc) => {
      if (doc) {
        console.log(doc.data());
        this.challengesList$.next(doc.data());
      }
    });
    console.log(table);
    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;
    return lastVisible;
  }

  async addChallenges(last) {
    const docRef = query(
      collection(this.db, 'challenges'),
      orderBy('dateCreation', 'desc'),
      startAfter(last),
      limit(15)
    );

    const documentSnapshots = await getDocs(docRef);

    documentSnapshots.forEach((doc) => {
      const document = doc.data();
      console.log(doc.data());
      this.challengesList$.next(document);
    });

    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;
    return lastVisible;
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
          this.challengeUser$.next(null);
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
          } else if (document.status == 'en attente' && bool) {
            this.challengeUser$.next(docFormat);
          } else if (document.status == 'en attente' && !bool) {
            console.log(docFormat);
            this.challenges$.next(docFormat);
          } else if (document.status == 'termine' && bool) {
            this.challengeTermines$.next(docFormat);
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
