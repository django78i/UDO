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
  champNetWorkList$: BehaviorSubject<any> = new BehaviorSubject(null);
  friendsListSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  db = getFirestore();
  messagesSubject$: Subject<any> = new Subject();
  singleChampSub$: Subject<any> = new Subject();
  unsubscribe: Unsubscribe;

  constructor(public userService: UserService) {}

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

  async getChampionnatNetwork() {
    this.champNetWorkList$ = new BehaviorSubject(null);

    const docRef = query(
      collection(this.db, 'championnats'),
      where('type', '==', 'Network'),
      limit(15)
    );
    const documentSnapshots = await getDocs(docRef);
    let table = [];
    documentSnapshots.forEach((doc) => {
      if (doc && doc.data().status == 'en attente') {
        console.log(doc.data());
        this.champNetWorkList$.next(doc.data());
        // table.push(doc.data());
      }
    });
    console.log(table);
  }

  async getChampionnat(uid) {
    console.log(uid);
    const users = JSON.parse(localStorage.getItem('usersList'));
    const docData = await getDoc(doc(this.db, 'championnats', uid));
    const dataDoc = docData.data();
    console.log(dataDoc);
    const champ = this.formatChamp(dataDoc, users);
    console.log(champ);
    this.singleChampSub$.next(champ);
  }

  getChampionnats() {
    const auth = getAuth();
    auth.currentUser.uid;

    const docRef = query(collection(this.db, 'championnats'));
    this.unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      const users = JSON.parse(localStorage.getItem('usersList'));
      querySnapshot.docChanges().forEach((changes) => {
        if (changes) {
          this.champSubject$.next(null);
          this.champEnCoursSubject$.next(null);
          this.champNetWork$.next(null);
        }
      });
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        const bool = document.participants.some(
          (users: any) => users.uid == auth.currentUser.uid
        );
        const docFormat = this.formatChamp(document, users);
        if (document.status == 'en cours' && bool) {
          this.champEnCoursSubject$.next(docFormat);
        } else if (
          document.status == 'en attente' &&
          bool &&
          document.type == 'Friends&Familly'
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
    const championnat = champ;
    console.log(champ);
    if (championnat.participants) {
      championnat.participants = championnat.participants.map((participant) => {
        const partFormat = users?.find((user) => participant.uid == user.uid);
        return { ...participant, user: partFormat };
      });
    }
    championnat.createur = users?.find(
      (user) => user.uid == championnat.createur.uid
    );
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

  async matchUser(niveau?, acitivities?: any[]) {
    const user = await this.userService.getCurrentUser();
    const friendsTable: any[] = user.friends;

    //Filtrage des amis si limite niveau active
    if (niveau != undefined) {
      const friendsFilter = friendsTable.filter(
        (friend) => friend.niveau > niveau.lower && friend.niveau < niveau.upper
      );
      console.log(friendsFilter, 'niveau on');
      this.friendsListSubject$.next(friendsFilter);
    } else {
      console.log(friendsTable, 'niveau off');
      this.friendsListSubject$.next(friendsTable);
    }
  }

  async updateChamp(champ) {
    await updateDoc(doc(this.db, 'championnats', champ.uid), champ);
  }

  async sendMessage(msg, post) {
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
    const docRef = query(
      collection(this.db, 'post-session-now', postUid, 'messages'),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
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
