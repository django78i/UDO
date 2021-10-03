import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  addDoc,
  collection,
  onSnapshot,
  getDocs,
  query,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(public platform: Platform, private googlePlus: GooglePlus) {}

  connectGoogle() {
    if (this.platform.is('android')) {
      this.googleSignIn();
    } else {
      this.logUserWithGoogle();
    }
  }

  async createUserDataBase(user, pseudo) {
    console.log(user, pseudo);
    const newUSer = {
      uid: user.uid,
      mail: user.email,
      displayName: pseudo,
    };
    const db = getFirestore();
    await setDoc(doc(db, 'pros', newUSer.uid), newUSer);
  }

  logUserWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        this.findUser(user.uid).then((userDatabase) => {
          if (!userDatabase) {
            console.log('notfind');
            this.createUserDataBase(user, user.displayName);
          } 
        });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  async findUser(userUid) {
    const db = getFirestore();
    const user = await getDoc(doc(db, 'users', userUid));
    return user;
  }

  async googleSignIn() {
    const auth = getAuth();
    try {
      const gplUser = await this.googlePlus.login({
        webClientId:
          '84932470385-pd9pgtetadfar56b667ggfprofeslf4b.apps.googleusercontent.com',
      });

      console.log(gplUser);

      signInWithCredential(
        auth,
        GoogleAuthProvider.credentialFromResult(gplUser.idToken)
      );

      auth.onAuthStateChanged((user) => {
        if (user) {
          this.findUser(user).then((userDatabase) => {
            if (!userDatabase) {
              this.createUserDataBase(user, user.displayName);
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  logout() {
    const auth = getAuth();
    auth.signOut();
  }
}
