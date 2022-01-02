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
  deleteDoc,
} from 'firebase/firestore';
import { UserService } from './user-service.service';
import { map } from 'rxjs/operators';
import { ChampionnatsService } from './championnats.service';
import { FeedCall } from '../models/api/feed.model';
import { FeedFormat } from '../models/format/feedFormat';

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
    public championnatService: ChampionnatsService,
    private feedApi: FeedCall,
    public feedFormat: FeedFormat
  ) {}

  /**Feed d'un championnat ou d'un challenge
   * @champUid : string
   * @competitionName : string
   */
  async feedQuery(champUid, competition) {
    const feedQueryReturn = await this.feedApi.feedQuery(champUid, competition);
    return feedQueryReturn
      ? this.feedFormat.returnQueryObject(feedQueryReturn)
      : { table: [], last: null };
  }

  /**feed global
   * @filter: string
   * returns Promise<any>
   */
  async feedFilter(filter: string) {
    const documentSnapshots = await this.feedApi.feedFilter(filter);
    return documentSnapshots
      ? this.feedFormat.returnQueryObject(documentSnapshots)
      : { table: [], last: null };
  }
  /**
   *
   * @param uid
   * @returns Promise<DocumentData>
   */
  async getPost(uid) {
    const db = getFirestore();
    const docSnap = await getDoc(doc(db, 'post-session-now', uid));
    return docSnap.data();
  }

  /**Ajout de la suite du feed général */
  async addQuery(last, filter?) {
    const documentSnapshots = await this.feedApi.addQuery(last, filter);
    return documentSnapshots
      ? this.feedFormat.returnQueryObject(documentSnapshots)
      : { table: [], last: null };
  }

  /**
   *
   * @param competition
   * @param last
   * @param champUid
   * @returns Promise QuerySnapshot<DocumentData>
   */
  async addFeedChamps(competition, last, champUid?) {
    const documentSnapshots = await this.feedApi.addFeedChamps(
      competition,
      last,
      champUid
    );
    return this.feedFormat.returnQueryObject(documentSnapshots);
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

  async deletePost(uid) {
    const db = getFirestore();
    const postRef = doc(db, 'post-session-now', uid);
    await deleteDoc(postRef);
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
