import { Injectable } from '@angular/core';
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
} from 'firebase/firestore';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChampionnatsService {
  champSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  champEnCoursSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  friendsListSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  db = getFirestore();
  messagesSubject$: Subject<any> = new Subject();

  constructor() {}

  async createChampionnat(champ) {
    const id = this.createId();
    champ = { ...champ, uid: id };
    await setDoc(doc(this.db, 'championnats', champ.uid), champ);
  }

  getChampionnatsEnCours(user) {
    const docRef = query(
      collection(this.db, 'championnats'),
      where('status', '==', 'en cours')
    );
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        const bool = document.participants.some(
          (users: any) => users.uid == user.uid
        );
        if (bool) {
          champs.push(doc.data());
        }
        this.champEnCoursSubject$.next(champs);
      });
    });
  }

  async getChampionnats(user) {
    const docRef = query(
      collection(this.db, 'championnats'),
      where('status', '==', 'en attente')
    );
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        const bool = document.participants.some(
          (users: any) => users.uid == user.uid
        );
        if (bool) {
          champs.push(doc.data());
        }
        this.champSubject$.next(champs);
      });
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

  async sendMessage(msg, postUid) {
    console.log(msg, postUid);
    await addDoc(collection(this.db, `post-session-now/${postUid}/messages`), msg);
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
