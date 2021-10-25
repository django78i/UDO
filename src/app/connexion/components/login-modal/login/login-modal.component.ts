import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatStepper } from '@angular/material/stepper';
import { getAuth } from '@firebase/auth';
import {
  LoadingController,
  ModalController,
  NavController,
  PickerController,
} from '@ionic/angular';
import { BehaviorSubject, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService as UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit, AfterViewInit {
  @ViewChild('stepperComp') stepperComp: MatStepper;
  pseudo: string = '';
  step: number = 0;
  sex: string = '';
  activitesList: any;
  physicalParam = {
    poids: 50,
    taille: 120,
  };
  user: any;
  stepperEvent: StepperSelectionEvent = new StepperSelectionEvent();

  constructor(
    public zone: NgZone,
    public modalCtl: ModalController,
    public picker: PickerController,
    public userService: UserService,
    public navController: NavController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtl.dismiss();
  }

  ngAfterViewInit() {
    // const auth = getAuth();
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     const userDataBase = from(this.userService.findUser(user.uid));
    //     userDataBase
    //       .pipe(
    //         tap((us) => {
    //           this.findPreference(us.data())
    //             ? this.redirect()
    //             : this.stepperComp.next();
    //         })
    //       )
    //       .subscribe((user) => {
    //         this.user = user.data();
    //         console.log(user.data());
    //       });
    //   }
    // });
    this.stepperComp?.selectionChange.subscribe((r) => {
      this.stepperEvent = r;
      console.log(r, this.pseudo);
      if (r.previouslySelectedIndex == 0 && this.pseudo != '') {
        console.log('augmente');
        this.step += 0.25;
      } else if (r.previouslySelectedIndex == 1 && this.sex != '') {
        this.step += 0.25;
      } else if (
        r.previouslySelectedIndex == 2 &&
        this.physicalParam.taille != 0 &&
        this.physicalParam.poids != 0
      ) {
        this.step += 0.25;
      }
    });
  }

  login() {
    this.userService.connectGoogle();
  }

  redirect() {
    this.navController.navigateForward(['']);
  }

  uploadFile(event) {
    console.log(event);
  }

  async saveOnBoarding() {
    const user = await this.userService.getCurrentUser();
    this.user = {
      ...user,
      sex: this.sex,
      activitesPratiquees: this.activitesList,
      userName: this.pseudo,
      physique: this.physicalParam,
    };
    const loading = await this.loadingController.create({
      message: 'Veuillez patienter...',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log(this.user, user);
    // this.userService.updateUser(this.user);
    // this.redirect();
  }

  findPreference(user): boolean {
    console.log(user);
    return user?.userName ? true : false;
  }

  change(ev) {
    console.log(ev);
  }

  physicParam(ev) {
    if (ev['poids']) {
      this.physicalParam.poids = ev.poids;
      console.log('poids');
    } else {
      this.physicalParam.taille = ev.taille;
      console.log('taille');
    }
    console.log(this.physicalParam);
  }

  choiceSex(event) {
    console.log(event);
    this.sex = event;
  }

  eventActivite(event) {
    console.log('ici', event);
    this.activitesList = event;
  }

  validate() {
    if (this.activitesList) {
      this.step += 0.25;
    }
    this.saveOnBoarding();
  }
}
