import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getAuth } from '@firebase/auth';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
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
  hide = true;
  seg = 's\'inscrire';
  @Output() log: EventEmitter<[]> = new EventEmitter();
  mdPasse  = '';
  email = '';
  user: any;
  errorSub: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    public userService: UserService,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    public navController: NavController,
    public modalController: ModalController,
    public zone: NgZone
  ) {}

  ngOnInit() {
    this.errorSub = this.userService.errorSubject$;
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setTimeout(() => {
          const userDataBase = from(this.userService.findUser(user.uid));
          userDataBase
            .pipe(
              tap((us) => {
                this.redirect(us.data());
              })
            )
            .subscribe();
        }, 1000);
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
}
