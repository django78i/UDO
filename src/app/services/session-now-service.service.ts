import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController, ToastController } from '@ionic/angular';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
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
  where,
} from 'firebase/firestore';
import {
  getAuth,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class SessionNowService {
  loader: HTMLIonLoadingElement;
  constructor(
    public platform: Platform, // private googlePlus: GooglePlus,
    public alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
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

  async findPostLies(postUid) {
    const db = getFirestore();
    const queryPost = query(
      collection(db, 'post-session-now'),
      where('sessionId', '==', postUid)
    );
    const document = await getDocs(queryPost);

    let donnees = [];
    document.forEach((doc) => (doc ? this.updatePostLies(doc.data().uid) : ''));
    console.log(donnees);
  }

  async updatePostLies(postUid) {
    const db = getFirestore();
    updateDoc(doc(db, 'post-session-now', postUid), { isLive: false });
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
}
