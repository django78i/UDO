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
import { UserServiceService as UserService } from 'src/app/services/user-service.service';

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
    public loadingController: LoadingController,
    public navController: NavController,
    public userService: UserService
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtl.dismiss();
  }

  ngAfterViewInit() {
    console.log(
      this.stepperComp?.selectionChange.subscribe((r) => {
        this.stepperEvent = r;
        console.log(r, this.pseudo);
        if (r.previouslySelectedIndex == 1 && this.pseudo != '') {
          console.log('augmente');
          this.step += 0.25;
        } else if (r.previouslySelectedIndex == 2 && this.sex != '') {
          this.step += 0.25;
        } else if (
          r.previouslySelectedIndex == 3 &&
          this.physicalParam.taille != 0 &&
          this.physicalParam.poids != 0
        ) {
          this.step += 0.25;
        }
      })
    );
  }

  async redirect(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Veuillez patienter...',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');

    this.navController.navigateForward(['']);
  }

  saveOnBoarding() {
    this.user = {
      ...this.user,
      sex: this.sex,
      activitesPratiquees: this.activitesList,
      userName: this.pseudo,
      physique: this.physicalParam,
    };
    console.log(this.user);
    this.userService.updateUser(this.user);
    this.redirect();
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
