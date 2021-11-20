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
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {userError} from "@angular/compiler-cli/src/transformers/util";

@Injectable({
  providedIn: 'root',
})
export class SessionNowService {
  loader: HTMLIonLoadingElement;
  user:any;
  constructor(
    private googlePlus: GooglePlus,
    public platform: Platform, // private googlePlus: GooglePlus,
    public alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http:HttpClient
  ) {}

  async create(document, collectionName) {
    const db = getFirestore();
    const id = this.createId();
    document = { ...document, uid: id };
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
    });
  }

  /**
   * cette fonction permet de supprimer en cascade une seance now
   * @param sessionId
   */
  async deleteSessionCascade(sessionId){
    let canDelete=true;
    const db = getFirestore();
    const queryPost = query(
      collection(db, 'post-session-now'),
      where('sessionId', '==', sessionId)
    );
    const document = await getDocs(queryPost);

    document.forEach((doc) => {
      if(doc){
          if(doc.data().reactionsNombre>0){
            canDelete=false;
          }
      }
    });
    if(canDelete){
      // on supprime la session now et tous les post liés
      deleteDoc(doc(db, 'session-now', sessionId));
      deleteDoc(doc(db, 'post-session-now', sessionId));
      document.forEach((doc) => (doc ? this.deletePostLies(doc.data().uid,db
      ) : ''));
    }else{
      // la session a un post commenté donc on supprime
      const document = await getDocs(queryPost);
      document.forEach((doc) => (doc ? this.updatePostLies(doc.data().uid) : ''));
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
    updateDoc(doc(db, 'post-session-now', postUid), { isLive: false });
  }
  async updateCompetition(sessionNow){
    this.user = JSON.parse(localStorage.getItem('user'));

    if(sessionNow.competitionType==='Séance Libre'){
      // cas seance libre
    }
    else if(sessionNow.competitionType==='Championnat'){
      // cas seance championnat
      this.updateChampionnat(this.user.uid,sessionNow);
    }
    else if(sessionNow.competitionType==='Challenge'){
      // TODO: cas Challenge
    }
  }
  async updateChallenge(userId,sessionNow){

  }
  async updateChampionnat(userId,sessionNow){
    const db = getFirestore();
    const queryPost = query(
      collection(db, 'championnats'),
      where('uid', '==', sessionNow.championnatId)
    );
    const document = await getDocs(queryPost);
    document.forEach((doc1) => {
      if(doc1 && doc1.data() && doc1.data().participants){
        let participants=doc1.data().participants;
        for(let participant of participants){
          if(participant.uid=userId){
            participant.point=participant.point?participant.point+3:3;
            // on incrémente la journee,
            participant.point=participant.point?participant.point+3:3;

            // bonus
          }
        }
        // on appelle la fonction qui fait le update du participant
        const part={  participants: participants};
        updateDoc(doc(db, 'championnats', sessionNow.championnatId), { part });
      }
    });
  }

  async deletePostLies(postUid,db) {
   // const db = getFirestore();
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

  getActivities(){
    return this.http.get('../../../assets/mocks/activitiesList.json').pipe();
  }
}
