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
  QuerySnapshot,
  DocumentData,
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
    this.singleChallSub$ = new BehaviorSubject(null);
    const docData = await (
      await getDoc(doc(this.db, 'challenges', uid))
    ).data();
    const champ = this.formatChall(docData);
    console.log(champ);
    this.singleChallSub$.next(champ);
  }

  /**
   * Challenge en attente et en cours dans la liste toutes le compétitions
   * @returns void
   */
  async getChallengesList() {
    this.challengesList$ = new BehaviorSubject(null);

    const docRef = query(
      collection(this.db, 'challenges'),
      orderBy('dateCreation', 'desc'),
      limit(15)
    );
    const documentSnapshots = await getDocs(docRef);
    this.pushChallenge(documentSnapshots);
    let table = [];
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

    this.pushChallenge(documentSnapshots);
    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;
    return lastVisible;
  }

  /**
   *
   * @param documentSnapshots
   */
  pushChallenge(documentSnapshots: QuerySnapshot<DocumentData>) {
    documentSnapshots.forEach((doc) => {
      if (doc) {
        console.log(doc.data());
        const document = doc.data();
        if (document.status == 'en cours' || document.status == 'en attente') {
          const docFormat = this.formatChall(document);
          this.challengesList$.next(docFormat);
        }
      }
    });
  }

  getChallenges() {
    const auth = getAuth();
    auth.currentUser.uid;

    const docRef = collection(this.db, 'challenges');
    this.unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      //détection des changements
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
          const docFormat = this.formatChall(document);
          console.log(docFormat);
          //tris des challenges
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

  formatChall(chall) {
    const users = JSON.parse(localStorage.getItem('usersList'));
    const challenge = chall;
    challenge.participants = challenge.participants.map((participant) => {
      const partFormat = users
        .map((r) => {
          return {
            avatar: r.avatar,
            userName: r.userName,
            uid: r.uid,
            niveau: r.niveau,
          };
        })
        .find((user) => participant.uid == user.uid);
      return { ...participant, user: partFormat };
    });
    return challenge;
  }
}
