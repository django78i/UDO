
import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { FacebookLoginPlugin } from '@capacitor-community/facebook-login';

import { UserService } from 'src/app/services/user-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getAuth } from '@firebase/auth';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { Plugins, registerWebPlugin } from '@capacitor/core';
import { isPlatform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FacebookLogin } from '@capacitor-community/facebook-login';
// @ts-ignore
registerWebPlugin(FacebookLogin);

import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';

@Component({
  selector: 'app-connexion-choice',
  templateUrl: './connexion-choice.component.html',
  styleUrls: ['./connexion-choice.component.scss'],
})
export class ConnexionChoiceComponent implements OnInit {
  fbLogin: any;
  //user = null;
  token = null;

  hide = true;
  seg = 's\'inscrire';
  @Output() log: EventEmitter<[]> = new EventEmitter();
  mdPasse  = '';
  email = '';
  user: any;
  errorSub: BehaviorSubject<string> = new BehaviorSubject(null);
  isConnected='';
  constructor(
    public userService: UserService,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    public navController: NavController,
    public modalController: ModalController,
    public zone: NgZone,
    private http: HttpClient
  ) {
    localStorage.setItem('firstConnexion','true');
    this.isConnected = localStorage.getItem('isConnected');
    if(this.isConnected === 'true'){
      this.seg = 'se connecter';
    }else{
      this.seg = 's\'inscrire';
    }
    this.setupFbLogin();
  }

  ngOnInit() {
    this.errorSub = this.userService.errorSubject$;
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {

      if (user) {
        // setTimeout(() => {
          const userDataBase = from(this.userService.findUser(user.uid));
          userDataBase
            .pipe(
              tap((us) => {
                this.redirect(us.data());
              })
            )
            .subscribe();
        // }, 1000);
      }
    });
  }

  login() {
    this.userService.connectGoogle();
  }

  async redirect(user): Promise<void> {
    console.log(user);
    const loading = await this.loadingController.create({
      message: 'Veuillez patienter...',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('2',  user);
    this.zone.run(() => {
      user.userName
        ? this.navController.navigateForward('')
        : this.navController.navigateForward('onboarding');
    });
  }

  connexion() {
    const formValue = {
      mail: this.email,
      password: this.mdPasse,
    };
    this.seg === 's\'inscrire'
      ? this.userService.createUser(formValue)
      : this.userService.log(formValue);
  }

  logout() {
    this.userService.logout();
  }

  segmentChanged(event) {
    this.seg = event.detail.value;
  }

  close() {
    this.modalController.dismiss();
  }
  retour() {
    this.navController.navigateBack('');
  }



  async setupFbLogin() {
    if (isPlatform('desktop')) {
      this.fbLogin = FacebookLogin;
    } else {
      // Use the native implementation inside a real app!
      const { FacebookLogin } = Plugins;
      this.fbLogin = FacebookLogin;
    }
  }

  async loginFb() {
    const FACEBOOK_PERMISSIONS = ['email', 'user_birthday'];
    const result = await this.fbLogin.login({ permissions: FACEBOOK_PERMISSIONS });

    if (result.accessToken && result.accessToken.userId) {
      console.log('result',result);
      this.token = result.accessToken;
     const  user1= await this.userService.fbAuth(this.token.token);
     this.user=user1;
     this.user.userName=this.user.displayName;
     // this.loadUserData();

    } else if (result.accessToken && !result.accessToken.userId) {
      // Web only gets the token but not the user ID
      // Directly call get token to retrieve it now
      this.getCurrentToken();
    } else {
      // Login failed
    }
  }

  async getCurrentToken() {
    const result = await this.fbLogin.getCurrentAccessToken();

    if (result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      // Not logged in.
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe(res => {
      this.user = res;
      console.log(this.user);

      if (this.user) {
        this.user.uid=this.user.id;
        this.userService.findUser(this.user.uid).then((userDatabase) => {
          this.user.userName=this.user.name;
          if (!userDatabase.data()) {
            this.userService.createUserDataBase(this.user);
          }
          this.user.userName=this.user.name;
          //this.redirect(this.user);
        });
      }
    });
  }

  async logoutFb() {
    await this.fbLogin.logout();
    this.user = null;
    this.token = null;
  }
}
