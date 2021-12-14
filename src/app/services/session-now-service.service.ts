import { Injectable } from '@angular/core';
import {
  AlertController,
  Platform,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import firebase from 'firebase/app';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HttpClient } from '@angular/common/http';
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  QuerySnapshot,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { MusicFeedService } from './music-feed.service';

@Injectable({
  providedIn: 'root',
})
export class SessionNowService {
  loader: HTMLIonLoadingElement;
  user: any;
  constructor(
    private googlePlus: GooglePlus,
    public platform: Platform, // private googlePlus: GooglePlus,
    public alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    public mFeed: MusicFeedService
  ) {}

  async create(document, collectionName) {
    const db = getFirestore();
    const id = this.createId();
    document = { ...document, uid: id };
    console.log(JSON.stringify(document));
    await setDoc(doc(db, collectionName, document.uid), document);
    return id;
  }

  async createSessionNow(document) {
    const db = getFirestore();
    const id = this.createId();
    document = { ...document, uid: id };
    await setDoc(doc(db, 'session-now', document.uid), document);
    return id;
  }

  async controlLive(uid) {
    console.log('control');
    // this.presentLoading();
    //récupération des posts de l'utilisateur
    const postList = await this.getSessionNow(uid);
    if (postList) {
      postList.forEach((post) => {
        const postData = post.data();
        console.log(postData);
        //update du post si il est toujours en live
        if (postData.isLive == true) {
          console.log(postData);
          //suppression du post de type sessionNow si aucune réaction pendant la séance
          if (postData.type == 'session-now') {
            this.deleteSessionCascade(postData.sessionId);
          } else {
            //update status du post
            this.updatePostLies(postData.uid);
          }
          // this.mFeed.feedFilter('Récent');
        }
      });
    }
    // this.dissmissLoading();
  }

  async updatePostSeanceNow(post) {
    const db = getFirestore();
    await updateDoc(doc(db, 'post-session-now', post.uid), post);
  }

  async getSessionNow(uid): Promise<QuerySnapshot<DocumentData>> {
    console.log('now');
    const db = getFirestore();
    const querySelect = query(
      collection(db, 'post-session-now'),
      where('userId', '==', uid)
    );
    const document = await getDocs(querySelect);
    return document;
  }

  async createPostSessionNow(document) {
    const db = getFirestore();
    // const id = this.createId();
    document = { ...document };
    await setDoc(doc(db, 'post-session-now', document.uid), document);
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

  async getCurrentUser(): Promise<DocumentData> {
    const auth = getAuth();
    const user = await auth.currentUser;
    const userDataBase = await this.find(user.uid, 'users');
    return userDataBase.data();
  }

  async find(uuid, collectionName): Promise<DocumentSnapshot<DocumentData>> {
    const db = getFirestore();
    const document = await getDoc(doc(db, collectionName, uuid));
    return document;
  }

  async update(document, collectionName) {
    const db = getFirestore();

    await updateDoc(doc(db, collectionName, document.uid), {
      isLive: false,
      type: document.type,
      metrics: document.metrics,
      photo: document.photo,
      startDate: document.startDate,
      comment: document.comment,
      duree: document.duree,
      challIcon: document.challIcon,
    });
  }

  /**
   * cette fonction permet de supprimer en cascade une seance now
   * @param sessionId
   */
  async deleteSessionCascade(sessionId) {
    let canDelete = true;
    const db = getFirestore();
    const queryPost = query(
      collection(db, 'post-session-now'),
      where('sessionId', '==', sessionId)
    );
    const document = await getDocs(queryPost);

    document.forEach((doc) => {
      if (doc) {
        if (doc.data().reactionsNombre > 0) {
          canDelete = false;
        }
      }
    });
    if (canDelete) {
      // on supprime la session now et tous les post liés
      deleteDoc(doc(db, 'session-now', sessionId));
      deleteDoc(doc(db, 'post-session-now', sessionId));
      document.forEach((doc) =>
        doc ? this.deletePostLies(doc.data().uid, db) : ''
      );
    } else {
      // la session a un post commenté donc on supprime
      const document = await getDocs(queryPost);
      document.forEach((doc) =>
        doc ? this.updatePostLies(doc.data().uid) : ''
      );
      updateDoc(doc(db, 'session-now', sessionId), { isLive: false });
    }
  }

  async findPostLies(postUid) {
    const db = getFirestore();
    const queryPost = query(
      collection(db, 'post-session-now'),
      where('sessionId', '==', postUid)
    );
    const document = await getDocs(queryPost);
    document.forEach((doc) => (doc ? this.updatePostLies(doc.data().uid) : ''));
  }

  async updatePostLies(postUid) {
    const db = getFirestore();
    await updateDoc(doc(db, 'post-session-now', postUid), {
      type: 'picture',
      isLive: false,
    });
  }

  updateCompetition(sessionNow) {
    console.log(sessionNow);
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(sessionNow);
    if (sessionNow.competitionType === 'Championnat') {
      // cas seance championnat
      this.updateChampionnat(this.user.uid, sessionNow);
    } else if (sessionNow.competitionType === 'Challenge') {
      // cas Challenge
      this.updateChallenge(this.user.uid, sessionNow);
    }
  }

  async updateChallenge(userId, sessionNow) {
    const db = getFirestore();
    const queryPost = await getDoc(
      doc(db, 'challenges', sessionNow.competitionId)
    );
    // const document = await getDocs(queryPost);
    console.log(sessionNow.metrics);

    if (queryPost && queryPost.data() && queryPost.data().participants) {
      let challenge = queryPost.data();
      let participants = challenge.participants;
      //recherche user en cours
      const ind = participants.findIndex((part) => part.uid == userId);
      //on ajoute 1 seance au participant
      participants[ind].seance =
        participants[ind].seance != 0 ? participants[ind].seance + 1 : 1;

      let metricValue;
      //recherche de la métrique à incrémenter
      metricValue = sessionNow.metrics.find(
        (sess) => challenge.metric.metric == sess.exposant
      );

      //on incémente l'avancé du participant
      participants[ind].value += metricValue.nombre;
      //on ajoute incémente l'avancé du challenge
      const evolution = Number(
        (
          Number(metricValue.nombre) + Number(challenge.completion.value)
        ).toFixed(2)
      );
      //contrôle si avancé supérieure à objectif
      challenge.completion.value =
        evolution >= Number(challenge.objectif) ? challenge.objectif : evolution;

      //MAJ du challenge
      const chall = { ...challenge, participants: participants };
      updateDoc(doc(db, 'challenges', sessionNow.competitionId), chall);
    }
  }

  async updateChampionnat(userId, sessionNow) {
    const db = getFirestore();
    const queryPost = query(
      collection(db, 'championnats'),
      where('uid', '==', sessionNow.competitionId)
    );
    const document = await getDocs(queryPost);
    document.forEach((doc1) => {
      console.log(doc1.data());
      if (doc1 && doc1.data() && doc1.data().participants) {
        let championnat = doc1.data();
        //Calcul journée en cours
        const journeeEnChamp = Number(
          championnat.semaineEnCours * championnat.seanceByWeek
        );
        let participants = doc1.data().participants;
        //recherche du user parmis les participants
        const ind = participants.findIndex((part) => part.uid == userId);
        //on ajoute 3 points au participants
        participants[ind].points =
          participants[ind].points != 0 ? participants[ind].points + 3 : 3;
        //La séance du user est une séance bonus
        const journey = Number(
          participants[ind].journeeEnCours + participants[ind].bonus
        );
        if (journey >= journeeEnChamp) {
          console.log('==');
          participants[ind].bonus += 1;
        } else {
          // on incrémente la journee,
          participants[ind].journeeEnCours = participants[ind].journeeEnCours =
            !0 ? participants[ind].journeeEnCours + 1 : 1;
        }
        const champ = { ...doc1.data(), participants: participants };
        console.log(champ);
        // on appelle la fonction qui fait le update du participant
        updateDoc(doc(db, 'championnats', sessionNow.competitionId), champ);
      }
    });
  }

  async deletePostLies(postUid, db) {
    deleteDoc(doc(db, 'post-session-now', postUid));
  }

  async show(message, color) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    toast.then((toastData) => {
      toastData.present();
    });
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl
      .create({
        spinner: 'bubbles',
        animated: true,
        mode: 'ios',
        showBackdrop: true,
        message: '',
      })
      .then();
    this.loader.present();
  }

  async dissmissLoading() {
    if (this.loader) {
      await this.loader.dismiss();
    }
  }

  getActivities() {
    return this.http.get('../../../assets/mocks/activitiesList.json').pipe();
  }
}
