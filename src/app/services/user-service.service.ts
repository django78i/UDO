import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
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
    if (this.platform.is('android')) {
      this.googleSignIn();
    } else {
      this.logUserWithGoogle();
    }
  }

  async createUserDataBase(user) {
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
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.findUser(user.uid).then((userDatabase) => {
          if (!userDatabase.data()) {
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
    localStorage.setItem('user', JSON.stringify(userDataBase.data()));
    return userDataBase.data();
  }

  async findUser(userUid): Promise<DocumentSnapshot<DocumentData>> {
    const user = await getDoc(doc(this.db, 'users', userUid));
    return user;
  }

  async updateUser(user) {
    await updateDoc(doc(this.db, 'users', user.uid), user);
  }

  async googleSignIn() {
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

      await auth.onAuthStateChanged((user) => {
        if (user) {
          this.findUser(user.uid).then((userDatabase) => {
            if (!userDatabase.data()) {
              this.createUserDataBase(user);
            }
          });
        } else {
          // this.presentAlert('rien');
        }
      });
    } catch (err) {}
  }

  log(info: any) {
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
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, info.mail, info.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.createUserDataBase(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
  async removeFriend(friend, user) {
    const userTemp = user;
    const ind = userTemp.friends.findIndex((us) => us.uid == friend.uid);
    ind != -1 ? userTemp.friends.splice(ind, 1) : '';
    await updateDoc(doc(this.db, 'users', userTemp.uid), userTemp);
  }

  async addFriend(friend, user) {
    var fr = friend;
    const us = user;
    us.friends
      ? us.friends.push({
          userName: fr.userName,
          uid: fr.uid,
          avatar: fr.avatar ? fr.avatar : '',
          niveau: fr.niveau,
        })
      : (us.friends = [
          {
            userName: fr.userName,
            uid: fr.uid,
            avatar: fr.avatar,
            niveau: fr.niveau,
          },
        ]);
    console.log(us);
    await updateDoc(doc(this.db, 'users', us.uid), us);
  }
  logout() {
    this.auth.signOut();
  }
}
