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
  user: any;
  constructor(
    public router: Router,
    public userService: UserService,
    public championnatService: ChampionnatsService
  ) {}

  //Feed d'un championnat
  async feedQuery(champUid) {
    console.log('là');
    const table = [];

    const db = getFirestore();

    // Query the first page of docs
    const first = query(
      collection(db, 'post-session-now'),
      where('competitionId', '==', champUid),
      orderBy('startDate', 'desc'),
      limit(15)
    );
    const documentSnapshots = await getDocs(first);
    // documentSnapshots.forEach((f) => {
    //   // this.lastVisible = f.data().key;
    //   table.push(f.data());
    // });

    return this.returnQueryObject(documentSnapshots);

    // // Get the last visible document
    // const lastVisible: any = documentSnapshots.docs[
    //   documentSnapshots.docs.length - 1
    // ]
    //   ? documentSnapshots.docs[documentSnapshots.docs.length - 1]
    //   : null;
    // console.log(documentSnapshots.docs.length);
    // return { table: table, last: lastVisible };
  }

  //Feed global
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
      case 'Populaire':
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
        if (tableFriends.length) {
          first = query(
            collection(db, 'post-session-now'),
            where('userId', 'in', tableFriends),
            orderBy('startDate', 'desc'),
            limit(15)
          );
        }
        break;
    }

    const documentSnapshots = await getDocs(first);
    return this.returnQueryObject(documentSnapshots);
  }

  /**Ajout de la suite du feed général */
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
          orderBy('reactionsNombre', 'desc'),
          startAfter(last),
          limit(15)
        );
        break;
      case 'Mes amis':
        const tableFriends: any[] = [];
        user.friends.forEach((friend) => tableFriends.push(friend.uid));
        if (tableFriends) {
          queryColl = query(
            collection(db, 'post-session-now'),
            where('userId', 'in', tableFriends),
            orderBy('reactionsNombre', 'desc'),
            startAfter(last),
            limit(15)
          );
        }
        break;
    }

    const documentSnapshots = await getDocs(queryColl);
    return this.returnQueryObject(documentSnapshots);
  }

  //Ajout de post dans le feed du championnat
  async addFeedChamps(last, champUid?) {
    const db = getFirestore();
    const queryColl = query(
      collection(db, 'post-session-now'),
      where('championnat', '==', champUid),
      startAfter(last),
      orderBy('startDate', 'desc'),
      limit(15)
    );
    const documentSnapshots = await getDocs(queryColl);
    return this.returnQueryObject(documentSnapshots);
  }

  //Retourne le tableau de résultat + dernier élément de la requête
  returnQueryObject(documentSnap) {
    const table = [];
    const users = JSON.parse(localStorage.getItem('usersList'));

    documentSnap.forEach((f: any) => {
      const data = f.data();
      console.log(data);
      const format = this.formatQuery(data, users);
      table.push({ ...data, user: format.findUser, postLast: format.postLast });
    });
    const lastVisible: any = documentSnap.docs[documentSnap.docs.length - 1]
      ? documentSnap.docs[documentSnap.docs.length - 1]
      : null;

    return { table: table, last: lastVisible };
  }

  //récupération des informations des auteurs des post en temps réél
  formatQuery(data, users) {
    let postLast;
    const findUser = users.find((user) => user.uid == data.userId);
    console.log(findUser);
    if (data.postLast) {
      const postUser = users.find(
        (user) => data.postLast.sender.uid == user.uid
      );
      data.postLast.sender = postUser;
      postLast = { ...data.postLast, sender: data.postLast.sender };
    }
    return { findUser, postLast };
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
