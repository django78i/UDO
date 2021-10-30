import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {
  LoadingController,
  ModalController,
  NavController,
  PickerController,
} from '@ionic/angular';
import { UserService as UserService } from 'src/app/services/user-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit, AfterViewInit, OnDestroy {
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
  picture: any;
  pictureURL: any;
  subscription: Subscription;
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
    this.subscription = this.stepperComp?.selectionChange.subscribe((r) => {
      this.stepperEvent = r;
      if (r.previouslySelectedIndex == 0 && this.pseudo != '') {
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

  async addPhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    var imageUrl = image.webPath;
    this.picture = theActualPicture;
  }

  savePhoto() {
    if (this.picture) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${new Date()}`);
      const uploadTask = uploadString(storageRef, this.picture, 'data_url');
      uploadTask.then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            this.pictureURL = downloadURL;
          });
        },
        (error) => {
          // Handle unsuccessful uploads
        }
      );
    }
    this.stepperComp.next();
  }

  async saveOnBoarding() {
    const user = await this.userService.getCurrentUser();
    this.user = {
      ...user,
      sex: this.sex,
      activitesPratiquees: this.activitesList,
      userName: this.pseudo,
      physique: this.physicalParam,
      avatar: this.pictureURL,
    };
    const loading = await this.loadingController.create({
      message: 'Veuillez patienter...',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    this.userService.updateUser(this.user);
    this.redirect();
  }

  findPreference(user): boolean {
    return user?.userName ? true : false;
  }

  physicParam(ev) {
    if (ev['poids']) {
      this.physicalParam.poids = ev.poids;
    } else {
      this.physicalParam.taille = ev.taille;
    }
  }

  choiceSex(event) {
    this.sex = event;
  }

  eventActivite(event) {
    this.activitesList = event;
  }

  validate() {
    if (this.activitesList) {
      this.step += 0.25;
    }
    this.saveOnBoarding();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
