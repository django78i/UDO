import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notificationsSubject$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  notificationsStatusSubject$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor() {}

  async createNotifications(notif) {
    const db = getFirestore();
    const id = this.createId();
    const not = { ...notif, uid: id, dateCreation: new Date() };
    console.log(not);
    await setDoc(doc(db, 'notifications', id), notif);
  }

  async getNotifications(id) {
    const db = getFirestore();
    const queryNot = query(
      collection(db, 'notifications'),
      where('users', 'array-contains', id),
      orderBy('dateCreation', 'desc')
    );
    const querySnapshot = await getDocs(queryNot);
    let table = [];
    querySnapshot.forEach((query) => {
      if (query) {
        table.push({ ...query.data(), user: this.formatQuery(query.data()) });
      }
    });
    console.log(table);
    return table;
  }

  async deleteNotif(id) {
    const db = getFirestore();
    const postRef = doc(db, 'notifications', id);
    await deleteDoc(postRef);
  }

  //récupération des informations auteur notif
  formatQuery(data) {
    console.log(data);
    const users = JSON.parse(localStorage.getItem('usersList'));

    const findUser = users.find((user) => user.uid == data.senderId);
    console.log(findUser);
    return findUser;
  }

  createId() {
    const guid = () => {
      const s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
      return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    };
    return guid();
  }
}
