import { Injectable } from '@angular/core';
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

  constructor() {}

  async findRoom(userUid, contactUid): Promise<any[]> {
    const db = getFirestore();
    const first = doc(db, 'rooms', userUid + contactUid);
    const second = doc(db, 'rooms', contactUid + userUid);
    let table;
    const querySnap = (await getDoc(first)).data()
      ? await (await getDoc(first))
      : await getDoc(second);
    table = querySnap.data();
    console.log(table)
    return table;
  }

  async createRoom(user, contact) {
    console.log('create');
    const db = getFirestore();
    const uid = user.uid + contact.uid;
    const roomInfo = {
      users: [
        {
          userName: user.userName,
          uid: user.uid,
          avatar: user.avatar,
          niveau: user.niveau,
        },
        {
          userName: contact.userName,
          uid: contact.uid,
          avatar: contact.avatar,
          niveau: contact.niveau,
        },
      ],
      dateCreation: new Date(),
      uid: uid,
      lastMsg: '',
    };
    await setDoc(doc(db, 'rooms', uid), roomInfo);
    return uid;
  }

  async getMessages(uid) {
    console.log(uid);
    const db = getFirestore();
    const docRef = query(
      collection(db, `rooms/${uid}/messages`),
      orderBy('date', 'asc')
    );
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        console.log(document)
        champs.push(document);
        this.msgSubject$.next(champs);
      });
    });
  }

  async sendMessage(roomId, msg) {
    const db = getFirestore();
    await addDoc(collection(db, `rooms/${roomId}/messages`), msg);
    await updateDoc(doc(db, `rooms/${roomId}`), {
      lastMsg: msg.text,
      timestamp: msg.date,
    });
  }

  getUserRoom(uid) {
    const db = getFirestore();
    const docRef = query(collection(db, 'rooms'));
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        console.log(document, uid)
        const bool = document.users.some((user: any) => user.uid == uid);
        if (bool) {
          champs.push(document);
        }
        console.log(champs)
        this.roomSubject$.next(champs);
      });
    });
  }
}
