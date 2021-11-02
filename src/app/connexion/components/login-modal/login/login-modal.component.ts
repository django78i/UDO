import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {
  IonSlides,
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
import { $ } from 'protractor';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit, AfterViewInit {
  @ViewChild('slider') sliderComp: IonSlides;
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

  slideOpts = {
    speed: 400,
  };
  activeIndex: number = 0;
  constructor(
    public zone: NgZone,
    public modalCtl: ModalController,
    public picker: PickerController,
    public userService: UserService,
    public navController: NavController,
    public loadingController: LoadingController,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtl.dismiss();
  }

  async change(event) {
    this.activeIndex = await this.sliderComp.getActiveIndex();
    console.log(this.activeIndex);
  }

  async ngAfterViewInit() {
    this.sliderComp.lockSwipeToNext(true);
    console.log(this.sliderComp.getActiveIndex());
    this.activeIndex = await this.sliderComp.getActiveIndex();
    console.log(this.activeIndex);
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

  changeInput(event) {
    this.pseudo = event.detail.value;
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
    if (this.pseudo != '') {
      this.step += 0.25;
      this.ref.detectChanges();
      this.slideNext();
    }
  }

  genderSlide() {
    if (this.physicalParam.taille !== 0 && this.physicalParam.poids !== 0) {
      this.step += 0.25;
      this.ref.detectChanges();
      this.slideNext();
    }
  }

  physicSlide() {
    if (this.physicalParam.taille !== 0 && this.physicalParam.poids !== 0) {
      this.step += 0.25;
      this.ref.detectChanges();
      this.slideNext();
    }
  }

  slideNext() {
    this.sliderComp.lockSwipes(false);
    this.sliderComp.slideNext();
    this.sliderComp.lockSwipes(true);
  }

  async saveOnBoarding() {
    const user = await this.userService.getCurrentUser();
    const table: any[] = [
      {
        name: 'corps haut',
        value: 0,
      },
      {
        name: 'corps bas',
        value: 0,
      },
      {
        name: 'souplesse',
        value: 0,
      },
      {
        name: 'explosivité',
        value: 0,
      },
      {
        name: 'cardio',
        value: 0,
      },
      {
        name: 'gainage',
        value: 0,
      },
    ];

    this.user = {
      ...user,
      sex: this.sex,
      activitesPratiquees: this.activitesList,
      userName: this.pseudo,
      physique: this.physicalParam,
      niveau: 0,
      metrics: table,
      friends: [],
      avatar: this.pictureURL
        ? this.pictureURL
        : 'https://img.icons8.com/ios-filled/50/000000/gender-neutral-user.png',
    };
    const loading = await this.loadingController.create({
      message: 'Veuillez patienter...',
      duration: 2000,
    });
    await loading.present();
    this.userService.updateUser(this.user);

    const { role, data } = await loading.onDidDismiss();

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
    console.log(event);
    this.activitesList = event;
    console.log(this.activitesList);
  }

  validate() {
    if (this.activitesList) {
      this.step += 0.25;
      this.ref.detectChanges();
    }
    this.saveOnBoarding();
  }
}
