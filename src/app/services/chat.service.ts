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
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  msgSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  roomSubject$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {}

  async findRoom(userUid, contactUid): Promise<any[]> {
    console.log('test');
    const db = getFirestore();
    const first = query(
      collection(db, 'rooms'),
      where('uid', '==', userUid + contactUid),
      where('uid', '==', contactUid + userUid)
    );
    const table = [];
    const querySnap = await getDocs(first);
    querySnap.forEach((room) => {
      room ? table.push(room) : '';
    });
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
    const docRef = query(collection(db, `rooms/${uid}/messages`));
    const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
      const champs = [];
      querySnapshot.forEach((doc) => {
        const document = doc.data();
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
        const bool = document.users.some((user: any) => user.uid == uid);
        if (bool) {
          champs.push(document);
        }
        this.roomSubject$.next(champs);
      });
    });
  }
}
