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
} from 'firebase/firestore';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root',
})
export class ChampionnatsService {
  champSubject$: Subject<any> = new Subject();
  champEnCoursSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  champNetWork$: BehaviorSubject<any> = new BehaviorSubject(null);
  friendsListSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  db = getFirestore();
  messagesSubject$: Subject<any> = new Subject();

  constructor() {}

  async createChampionnat(champ) {
    console.log(champ);
    const id = this.createId();
    champ = { ...champ, uid: id };
    await setDoc(doc(this.db, 'championnats', champ.uid), champ);
  }

  getChampionnatsEnCours(): BehaviorSubject<any> {
    const docRef = query(
      collection(this.db, 'championnats'),
      where('status', '==', 'en cours')
    );
    const auth = getAuth();

    onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        const document = doc.data();
        const bool = document.participants.some(
          (users: any) => users.uid == auth.currentUser.uid
        );
        if (bool) {
          champs.push(doc.data());
        }
        this.champEnCoursSubject$.next(champs);
      });
    });
    return this.champEnCoursSubject$;
  }

  getChampionnatNetwork() {
    const docRef = query(
      collection(this.db, 'championnats')
      // where('type', '==', 'network')
    );
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        this.champNetWork$.next(document);
      });
    });
  }

  getChampionnats() {
    const auth = getAuth();
    auth.currentUser.uid;

    const docRef = query(collection(this.db, 'championnats'));
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      const users = JSON.parse(localStorage.getItem('usersList'));
      querySnapshot.docChanges().forEach((changes) => {
        if (changes) {
          this.champSubject$.next(null);
          this.champEnCoursSubject$.next(null);
        }
      });
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        const bool = document.participants.some(
          (users: any) => users.uid == auth.currentUser.uid
        );
        console.log(document);
        const docFormat = this.formatChamp(document, users);
        console.log(docFormat);
        if (document.status == 'en cours' && bool) {
          this.champEnCoursSubject$.next(docFormat);
        } else if (
          document.status == 'en attente' &&
          bool &&
          document.type == 'Friends&familly'
        ) {
          this.champSubject$.next(docFormat);
        } else if (
          document.status == 'en attente' &&
          bool &&
          document.type == 'Network'
        ) {
          this.champNetWork$.next(docFormat);
        }
      });
    });
  }

  formatChamp(champ, users) {
    console.log(users);
    const championnat = champ;
    championnat.participants = championnat.participants.map((participant) => {
      const partFormat = users?.find((user) => participant.uid == user.uid);
      return { ...participant, user: partFormat };
    });
    championnat.createur = users?.find(
      (user) => user.uid == championnat.createur.uid
    );
    console.log(championnat);
    return championnat;
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

  matchUser(niveau?, acitivities?: any[]) {
    const userRef = collection(this.db, 'users');
    const querySnapshot =
      niveau != undefined
        ? from(
            getDocs(
              query(
                userRef,
                where('niveau', '<=', niveau.upper),
                where('niveau', '>=', niveau.lower)
              )
            )
          )
        : from(getDocs(userRef));

    querySnapshot
      .pipe(
        map((r) => r.docs),
        map((users) => {
          const userFilter = users.filter((user) => {
            const activitiesTable: [] = user.data().activitesPratiquees;
            const verif = acitivities.length
              ? activitiesTable?.some((act) => acitivities.includes(act))
              : true;
            return verif;
          });
          let tableUser = [];
          userFilter.forEach((r) => {
            tableUser.push(r.data());
          });
          this.friendsListSubject$.next(tableUser.length ? tableUser : null);
          return tableUser;
        })
      )
      .subscribe();
  }

  async updateChamp(champ) {
    await updateDoc(doc(this.db, 'championnats', champ.uid), champ);
  }

  async sendMessage(msg, post) {
    console.log(msg, post);
    post.postCount += 1 as Number;
    const postLast = msg;
    await addDoc(
      collection(this.db, `post-session-now/${post.uid}/messages`),
      msg
    );
    await updateDoc(doc(this.db, `post-session-now/${post.uid}`), {
      postCount: post.postCount,
      postLast: postLast,
    });
  }

  async getMessage(postUid) {
    console.log('mess');

    const docRef = query(
      collection(this.db, 'post-session-now', postUid, 'messages'),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      console.log(champs);
      console.log(querySnapshot.docs.length);
      querySnapshot.docs.length
        ? querySnapshot.forEach((doc) => {
            champs.push(doc.data());
            console.log(doc.data());
            this.messagesSubject$.next(champs);
          })
        : this.messagesSubject$.next(null);
    });
  }
}
