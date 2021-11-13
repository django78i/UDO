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
  where,
} from 'firebase/firestore';
import { UserService } from './user-service.service';
import { map } from 'rxjs/operators';
import { ChampionnatsService } from './championnats.service';

@Injectable({
  providedIn: 'root',
})
export class MusicFeedService {
  currentPlay$: Subject<boolean> = new Subject();
  lastVisible: any;
  constructor(
    public router: Router,
    public userService: UserService,
    public championnatService: ChampionnatsService
  ) {}

  async getFeed() {
    const table = [];
    const user = await this.userService.getCurrentUser();
    const db = getFirestore();
    const first = query(
      collection(db, 'post-session-now'),
      orderBy('startDate', 'desc')
    );

    const documentSnapshots = await getDocs(first);

    documentSnapshots.forEach((f) => {
      table.push(f.data());
    });
    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;
    console.log(documentSnapshots.docs.length);

    return { table: table, last: lastVisible };
  }

  async feedFilter(filter: string) {
    console.log(filter);
    const table = [];
    const db = getFirestore();
    let first;
    const user = await this.userService.getCurrentUser();
    console.log(user);
    switch (filter) {
      case 'En direct':
        console.log('direct');
        first = query(
          collection(db, 'post-session-now'),
          where('isLive', '==', true),
          orderBy('startDate', 'desc'),
          limit(15)
        );
        break;
      case 'Récent':
        first = query(
          collection(db, 'post-session-now'),
          orderBy('startDate', 'desc'),
          limit(15)
        );
        break;
      case 'les + commentés':
        first = query(
          collection(db, 'post-session-now'),
          // where('isLive', '==', true),
          orderBy('postCount', 'desc'),
          limit(15)
        );
        break;
      case 'Mes amis':
        const tableFriends: any[] = [];
        user.friends.forEach((friend) => tableFriends.push(friend.uid));
        first = query(
          collection(db, 'post-session-now'),
          where('userId', 'in', tableFriends),
          orderBy('startDate', 'desc'),
          limit(15)
        );
        break;
    }

    let documentSnapshots;

    documentSnapshots = await getDocs(first);
    console.log(documentSnapshots);
    documentSnapshots.forEach((f) => {
      console.log(f.data());
      table.push(f.data());
    });

    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;
    console.log(documentSnapshots.docs.length);

    return { table: table, last: lastVisible };
  }

  async getPostFriend(uid) {
    const db = getFirestore();
    const req = query(
      collection(db, 'post-session-now'),
      where('userId', '==', uid),
      orderBy('startDate', 'desc')
    );
    const documentSnapshots = await getDocs(req);
    let table = [];
    documentSnapshots.forEach((f) => {
      table.push(f.data());
    });
    return table;
  }

  async feedQuery(champUid) {
    console.log('là');
    const table = [];

    const db = getFirestore();

    // Query the first page of docs
    const first = query(
      collection(db, 'post-session-now'),
      where('championnat', '==', champUid),
      orderBy('startDate', 'desc'),
      limit(15)
    );
    const documentSnapshots = await getDocs(first);
    documentSnapshots.forEach((f) => {
      // this.lastVisible = f.data().key;
      table.push(f.data());
    });

    // Get the last visible document
    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;
    console.log(documentSnapshots.docs.length);
    return { table: table, last: lastVisible };
  }

  async addQuery(last, filter?) {
    const db = getFirestore();
    const table = [];
    let queryColl;
    const user = await this.userService.getCurrentUser();

    //requête en fonction du filtre de feed
    switch (filter) {
      case 'En direct':
        console.log('direct');
        queryColl = query(
          collection(db, 'post-session-now'),
          where('isLive', '==', true),
          orderBy('startDate', 'desc'),
          startAfter(last),
          limit(15)
        );
        break;
      case 'Récent':
        queryColl = query(
          collection(db, 'post-session-now'),
          orderBy('startDate', 'desc'),
          startAfter(last),
          limit(15)
        );
        break;
      case 'Tendance':
        queryColl = query(
          collection(db, 'post-session-now'),
          // where('isLive', '==', true),
          orderBy('reactionsNombre', 'desc'),
          startAfter(last),
          limit(15)
        );
        break;
      case 'Mes amis':
        const tableFriends: any[] = [];
        user.friends.forEach((friend) => tableFriends.push(friend.uid));
        queryColl = query(
          collection(db, 'post-session-now'),
          where('userId', 'in', tableFriends),
          orderBy('reactionsNombre', 'desc'),
          startAfter(last),
          limit(15)
        );
        break;
    }
    const documentSnapshots = await getDocs(queryColl);
    documentSnapshots.forEach((f) => {
      table.push(f.data());
    });
    const lastVisible: any = documentSnapshots.docs[
      documentSnapshots.docs.length - 1
    ]
      ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
      : null;

    return { table: table, last: lastVisible };
  }

  async createReactionSeanceNow(post, reaction) {
    const db = getFirestore();
    const indice = this.championnatService.createId();
    const reactionSeanceNow = {
      ...reaction,
      uid: indice,
    };
    console.log(reaction, post);
    await setDoc(
      doc(db, `session-now/${post.uid}/reactions/`, indice),
      reactionSeanceNow
    );
  }

  async updatePost(post) {
    const db = getFirestore();
    const postRef = doc(db, 'post-session-now', post.uid);
    await updateDoc(postRef, {
      reactions: post.reactions,
      reactionsNombre: post.reactionsNombre,
    });
  }

  async updateSeance(post) {
    const db = getFirestore();
    const postRef = doc(db, 'session-now', post.uid);
    await updateDoc(postRef, {
      reactions: post.reactions,
    });
  }

  async sendPost(post) {
    console.log(post);
    const db = getFirestore();
    const indice = this.championnatService.createId();
    const postModel = {
      ...post,
      uid: indice,
    };
    await setDoc(doc(db, 'post-session-now', indice), postModel);
  }
}
