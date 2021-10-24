import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import firebase from 'firebase/app';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  db = getFirestore();
  auth = getAuth();
  constructor(
    private googlePlus: GooglePlus,
    public platform: Platform, // private googlePlus: GooglePlus,
    public alertController: AlertController
  ) {}

  connectGoogle() {
    console.log('check');
    if (this.platform.is('android')) {
      console.log('androZone');
      this.googleSignIn();
    } else {
      console.log('NotandroZone');
      this.logUserWithGoogle();
    }
  }

  async createUserDataBase(user) {
    console.log(user);
    const newUSer = {
      uid: user.uid,
      mail: user.email,
    };
    // const db = getFirestore();
    await setDoc(doc(this.db, 'users', newUSer.uid), newUSer);
  }

  logUserWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        console.log(result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        this.findUser(user.uid).then((userDatabase) => {
          if (!userDatabase.data()) {
            console.log('notfind');
            this.createUserDataBase(user);
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

  async getCurrentUser(): Promise<DocumentData> {
    const user = await this.auth.currentUser;
    const userDataBase = await this.findUser(user.uid);
    console.log(userDataBase.data());
    return userDataBase.data();
  }

  async findUser(userUid): Promise<DocumentSnapshot<DocumentData>> {
    console.log(userUid);
    const user = await getDoc(doc(this.db, 'users', userUid));
    console.log('UserFind', JSON.stringify(user.data()));
    return user;
  }

  async updateUser(user) {
    await updateDoc(doc(this.db, 'users', user.uid), user);
  }

  async googleSignIn() {
    console.log('entree');
    const auth = getAuth();
    try {
      const gplUser = await this.googlePlus.login({
        webClientId:
          '911285735248-p38u0egepsqdnjc0stbmepg11g1cf4bc.apps.googleusercontent.com',
      });

      await signInWithCredential(
        auth,
        GoogleAuthProvider.credential(gplUser.idToken)
      );

      // console.log('userGoogle',auth);
      console.log('userGoogle', gplUser.idToken);

      await auth.onAuthStateChanged((user) => {
        if (user) {
          this.findUser(user.uid).then((userDatabase) => {
            // console.log('userDatabase', userDatabase);
            if (!userDatabase.data()) {
              console.log('userDatabase', userDatabase);
              this.createUserDataBase(user);
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  log(info: any) {
    console.log(info);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, info.mail, info.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  createUser(info) {
    console.log(info);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, info.mail, info.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.createUserDataBase(user);
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  logout() {
    this.auth.signOut();
  }
}
