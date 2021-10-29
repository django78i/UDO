import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Subject } from 'rxjs';
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  limit,
  orderBy,
  startAfter,
} from 'firebase/firestore';
import { UserService } from './user-service.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MusicFeedService {
  currentPlay$: Subject<boolean> = new Subject();
  lastVisible: any;
  constructor(public router: Router, public userService: UserService) {}

  async getFeed() {
    const table = [];
    const user = await this.userService.getCurrentUser();
    const db = getFirestore();
    const feedList = await getDocs(collection(db, 'session-now'));
    feedList.forEach((f) => {
      table.push({
        ...f.data(),
        user: {
          avatar: '../../assets/mocks/2.jpg',
          name: 'julio',
        },
        createurUid: 'YYXXOwgQgpN1shkyYXdTzyyUgmI3',
      });
    });
    return table;
  }

  async feedQuery() {
    const table = [];

    const db = getFirestore();

    // Query the first page of docs
    const first = query(
      collection(db, 'session-now'),
      orderBy('startDate'),
      limit(15)
    );
    const documentSnapshots = await getDocs(first);
    documentSnapshots.forEach((f) => {
      // this.lastVisible = f.data().key;
      table.push({
        ...f.data(),
        user: {
          avatar: '../../assets/mocks/2.jpg',
          name: 'julio',
        },
        championnat: 'e46c71c5bbe5aac6c708c2a91ea94661',
        createurUid: 'YYXXOwgQgpN1shkyYXdTzyyUgmI3',
      });
    });

    // Get the last visible document
    // this.lastVisible =
    this.lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    return { table: table, last: this.lastVisible };
  }

  async addQuery(last) {
    const db = getFirestore();
    const table = [];
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const next = query(
      collection(db, 'session-now'),
      orderBy('startDate'),
      startAfter(last),
      limit(18)
    );
    const documentSnapshots = await getDocs(next);
    documentSnapshots.forEach((f) => {
      table.push({
        ...f.data(),
        user: {
          avatar: '../../assets/mocks/2.jpg',
          name: 'julio',
        },
        createurUid: 'YYXXOwgQgpN1shkyYXdTzyyUgmI3',
      });
    });
    return table;
  }
}
