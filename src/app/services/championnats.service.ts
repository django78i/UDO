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
import { BehaviorSubject, from, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService as NotificationService } from './notification-service.service';
import { UserService } from './user-service.service';

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
export class ChampionnatsService {
  champSubject$: Subject<any> = new Subject();
  champEnCoursSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  champNetWork$: BehaviorSubject<any> = new BehaviorSubject(null);
  champNetWorkList$: BehaviorSubject<any> = new BehaviorSubject(null);
  champtermines$: BehaviorSubject<any> = new BehaviorSubject(null);
  friendsListSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  db = getFirestore();
  messagesSubject$: Subject<any> = new Subject();
  singleChampSub$: Subject<any> = new Subject();
  unsubscribe: Unsubscribe;
  unsubscribe2: Unsubscribe;

  constructor(
    public userService: UserService,
    public notificationService: NotificationService
  ) {}

  async createChampionnat(champ) {
    const auth = getAuth();

    const id = this.createId();
    champ = { ...champ, uid: id };

    //utilisateurs à notifier
    const participantsToNotify = champ.participants
      .filter((part) => auth.currentUser.uid != part.uid)
      .map((part) => part.uid);

    const notification: Notification = {
      type: `invitation championnat ${champ.type}`,
      competitionName: champ.name,
      linkId: champ.uid,
      users: participantsToNotify,
      senderId: champ.createur.uid,
      dateCreation: new Date(),
    };
    this.notificationService.createNotifications(notification);
    await setDoc(doc(this.db, 'championnats', champ.uid), champ);
  }

  async getChampionnatNetwork() {
    this.champNetWorkList$ = new BehaviorSubject(null);
    const users = JSON.parse(localStorage.getItem('usersList'));

    const docRef = query(
      collection(this.db, 'championnats'),
      where('type', '==', 'Network'),
      where('status', '==', 'en attente'),
      orderBy('dateCreation', 'desc'),
      limit(15)
    );
    const documentSnapshots = await getDocs(docRef);
    let table = [];
    documentSnapshots.forEach((doc) => {
      const document = doc.data();
      const docFormat = this.formatChamp(document, users);

      if (document) {
        console.log(doc.data());
        this.champNetWorkList$.next(docFormat);
      }
    });
    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;
    return lastVisible;
    console.log(table);
  }

  async addNetWork(last) {
    const users = JSON.parse(localStorage.getItem('usersList'));
    console.log(last);
    const docRef = query(
      collection(this.db, 'championnats'),
      where('type', '==', 'Network'),
      where('status', '==', 'en attente'),
      orderBy('dateCreation', 'desc'),
      startAfter(last),
      limit(15)
    );
    const documentSnapshots = await getDocs(docRef);
    let table = [];
    documentSnapshots.forEach((doc) => {
      const document = doc.data();
      const docFormat = this.formatChamp(document, users);
      console.log(doc.data());
      this.champNetWorkList$.next(docFormat);
    });
    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;
    return lastVisible;
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

    const docRef = query(
      collection(this.db, 'championnats')
      // orderBy('dateCreation'),
      // limit(10)
    );
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
        } else if (document.status == 'en attente' && bool) {
          this.champSubject$.next(docFormat);
        } else if (
          document.status == 'en attente' &&
          !bool &&
          document.type == 'Network'
        ) {
          this.champNetWork$.next(docFormat);
        } else if (document.status == 'termine' && bool) {
          this.champtermines$.next(docFormat);
          console.log(docFormat);
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
