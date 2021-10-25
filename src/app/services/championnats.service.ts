import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  Query,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChampionnatsService {
  champSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  champEnCoursSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  friendsListSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  db = getFirestore();
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
    console.log(user);
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
      console.log(champs);
    });
  }

  async getChampionnats() {
    const docRef = query(collection(this.db, 'championnats'));
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

  matchUser(niveau?, acitivities?: any[]) {
    console.log(niveau, acitivities);
    const userRef = collection(this.db, 'users');
    const querySnapshot =
      niveau != undefined
        ? from(
            getDocs(
              query(
                userRef,
                where('niveau', '<=', niveau.upper)
                // where('niveau', '>=', niveau.lower)
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
            console.log(r.data());
            tableUser.push(r.data());
          });
          this.friendsListSubject$.next(tableUser.length ? tableUser : null);
          return tableUser;
        })
      )
      .subscribe();
  }
}
