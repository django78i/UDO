import { Injectable } from '@angular/core';
import { Unsubscribe } from '@firebase/util';
import { getAuth } from 'firebase/auth';
import {
  doc,
  addDoc,
  getFirestore,
  setDoc,
  query,
  collection,
  where,
  getDocs,
  getDoc,
  onSnapshot,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  msgSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  roomSubject$: Subject<any> = new Subject();
  msgAlert: BehaviorSubject<boolean> = new BehaviorSubject(false);
  unsubscribeRoom: Unsubscribe;
  msgSubcription: Unsubscribe;
  constructor() {
  }

  async findRoom(userUid, contactUid): Promise<any[]> {
    console.log(userUid, contactUid);
    const db = getFirestore();
    const first = doc(db, 'rooms', userUid + contactUid);
    const second = doc(db, 'rooms', contactUid + userUid);
    let table;
    const querySnap = (await getDoc(first)).data()
      ? await await getDoc(first)
      : await getDoc(second);
    table = querySnap.data();
    console.log(table);
    return table;
  }

  async createRoom(user, contact) {
    console.log('create');
    const db = getFirestore();
    const uid = user.uid + contact.uid;
    const roomInfo = {
      users: [user.uid, contact.uid],
      dateCreation: new Date(),
      uid: uid,
      lastMsg: '',
    };
    await setDoc(doc(db, 'rooms', uid), roomInfo);
    return uid;
  }

  async getMessages(room, uid) {
    this.msgSubject$ = new BehaviorSubject(null);
    console.log(uid);
    const db = getFirestore();
    const auth = getAuth();

    const docRef = query(
      collection(db, `rooms/${uid}/messages`),
      orderBy('date', 'asc')
    );
    //le dernier msg envoyé n'est pas de l'utilsateur,
    console.log(room.senderId, auth.currentUser.uid);
    if (room.senderId != auth.currentUser.uid) {
      this.updateRoomState(uid, false);
    }
    this.msgSubcription = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.docChanges().forEach((changes) => {
        if (changes) {
          this.msgSubject$.next(null);
        }
      });

      querySnapshot.forEach((doc) => {
        const document = doc.data();
        console.log(document);
        champs.push(document);
        this.msgSubject$.next(document);
      });
    });
  }

  async sendMessage(roomId, msg) {
    const db = getFirestore();
    await addDoc(collection(db, `rooms/${roomId}/messages`), msg);
    await updateDoc(doc(db, `rooms/${roomId}`), {
      lastMsg: msg.text,
      timestamp: msg.date,
      senderId: msg.senderId,
      new: true,
    });
  }

  /**
   * gestion de la vue des messages
   * @param uid
   */
  async updateRoomState(uid, status: boolean) {
    const db = getFirestore();
    console.log(status);
    await updateDoc(doc(db, `rooms/${uid}`), {
      new: status,
    });
  }

  getUserRoom(uid) {
    this.roomSubject$ = new BehaviorSubject(null);
    console.log(uid);
    const db = getFirestore();
    const auth = getAuth();
    const docRef = query(
      collection(db, 'rooms'),
      where('users', 'array-contains', uid),
      orderBy('timestamp', 'desc')
    );
    this.unsubscribeRoom = onSnapshot(docRef, (querySnapshot) => {
      let indexChange;
      const currentUser = auth.currentUser.uid;

      querySnapshot.docChanges().forEach((changes) => {
        this.roomSubject$.next(null);
        if (changes.type == 'modified') {
          console.log(changes);
          // indexChange = changes.oldIndex;
          const room = changes.doc.data();
          // indexChange = changes.doc.data().uid;
          // if (indexChange == currentUser) {
          // }
        }
      });
      let count = 0;
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        console.log(document, uid);
        if (document) {
          console.log(document);
          const contact = document.users.find((cont) => cont != currentUser);
          console.log(contact);
          if (document.senderId == contact && document.new == true) {
            count += 1;
          }
          const room = this.formatRoom(document, contact);
          console.log(room);
          this.roomSubject$.next(room);
        }
      });
      console.log(count)
      count > 0 ? this.msgAlert.next(true) : this.msgAlert.next(false);
    });
  }

  formatRoom(room, userId) {
    const users = JSON.parse(localStorage.getItem('usersList'));
    const findUser = users.find((user) => user.uid == userId);
    const roomForomat =
      room.senderId == userId && room.new == true
        ? { ...room, userInfo: findUser, vue: false }
        : { ...room, userInfo: findUser, vue: true };
    console.log(roomForomat);
    //contrôle de l'émtteur du dernier message
    return roomForomat;
  }
}
