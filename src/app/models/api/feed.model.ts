import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { UserService } from 'src/app/services/user-service.service';

@Injectable()
export class FeedCall {
  constructor(private userService: UserService) {}

  public async feedFilter(filter: string): Promise<any> {
    const db = getFirestore();
    let first;
    const user = await this.userService.getCurrentUser();
    switch (filter) {
      case 'En direct':
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
          orderBy('reactionsNombre', 'desc'),
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
    console.log(first)
    return first ? await getDocs(first) : null;
  }

  public async feedQuery(champUid, competition): Promise<any> {
    console.log('là');
    const table = [];

    const db = getFirestore();
    console.log(competition);
    // Query the first page of docs
    const first = query(
      collection(db, 'post-session-now'),
      where('competitionId', '==', champUid),
      orderBy('startDate', 'desc'),
      limit(15)
    );
    return await getDocs(first);
  }

  public async addQuery(last, filter?) {
    const db = getFirestore();
    let queryColl;
    const user = await this.userService.getCurrentUser();
    console.log(last);
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
      case 'Populaire':
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
        if (tableFriends.length) {
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

    return await getDocs(queryColl);
  }

  public async addFeedChamps(competition, last, champUid?) {
    const db = getFirestore();
    const queryColl = query(
      collection(db, 'post-session-now'),
      where(competition, '==', champUid),
      orderBy('startDate', 'desc'),
      startAfter(last),
      limit(15)
    );
    return await getDocs(queryColl);
  }
}
