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
  AlertController,
  IonSlides,
  LoadingController,
  ModalController,
  NavController,
  PickerController,
  Platform,
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
import { SessionNowService } from 'src/app/services/session-now-service.service';
import { Router } from '@angular/router';

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
  currentSlide=0;
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

  jour ='';
  mois =''
  annee ='';

  activeIndex: number = 0;
  fabButton="c-fab";
  title="Suivant";
  ignorerText="Ignorer";
  errorPseudo="";
  invalidInput="";
  invalidDate="";
  constructor(
    public zone: NgZone,private router: Router,
    public modalCtl: ModalController,
    public picker: PickerController,
    public userService: UserService,
    public navController: NavController,
    public loadingController: LoadingController,
    public ref: ChangeDetectorRef,
    public sessionNowService: SessionNowService,
    private platform:Platform, private alertController:AlertController
  ) {
    this.fabButton ="c-fab";
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.presentAlertConfirm();
    });
  }

  ngOnInit() {
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      mode: 'ios',
      message: "Voulez vous vraiment arreter l'inscription",
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          },
        },
        {
          text: 'Oui',
          handler: () => {
            // on quitte l'application et on supprime tous les posts
            this.router.navigate(['login']);
           // this.displayRecap();
          },
        },
      ],
    });

    await alert.present();
  }
  close() {
    this.modalCtl.dismiss();
  }

  async change(event) {
    this.activeIndex = await this.sliderComp.getActiveIndex();
  }

  async ngAfterViewInit() {
    this.sliderComp.lockSwipeToNext(true);
    this.activeIndex = await this.sliderComp.getActiveIndex();
    this.fabButton ="c-fab";
  }

  login() {
    this.userService.connectGoogle();
  }

  redirect() {
    this.sliderComp.lockSwipes(true);
    this.navController.navigateForward(['']);
    localStorage.setItem('isConnected',"true");
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
  nextStep(){
    if(this.activeIndex == 0){
      this.savePhoto();
    }else if(this.activeIndex == 1){
      this.saveDateNaiss();
    }else if(this.activeIndex == 2){
      this.genderSlide();
    }else if(this.activeIndex == 3){
      this.physicSlide();
    }
  }
  saveDateNaiss(){
    if(this.fabButton == 'c-fab-img2'){
      this.step += 0.2;
      this.ref.detectChanges();
      this.slideNext();
      this.fabButton = "c-fab";
    }
  }

  ignorer(){
    this.step += 0.2;
    this.ref.detectChanges();
    this.slideNext();
    this.fabButton = "c-fab";
   /* if(this.activeIndex===4){
      this.sliderComp.lockSwipeToPrev(true);
    }*/

  }

  checkPseudo(){
    if(this.pseudo!='' && this.pseudo.toLowerCase() != 'admin'){
      this.fabButton="c-fab-img";
    }else{
      this.fabButton="c-fab";
    }
    if(this.pseudo.toLocaleLowerCase() == 'admin'){
      this.errorPseudo ="Ce pseudo est interdit";
      this.invalidInput ="mat-form-field-invalid";
    }else{
      this.errorPseudo="";
      this.invalidInput ="";
    }
  }

  checkDate(){
    if(parseInt(this.jour)>31 || parseInt(this.jour)<0){
      this.invalidDate = "Date invalide";
      return;
    }
    if(parseInt(this.mois)>12 || parseInt(this.jour)<0){
      this.invalidDate = "Date invalide";
      return;
    }
    this.invalidDate="";
    if(this.jour!='' && this.jour.length == 2 && this.mois!='' && this.mois.length ==2 && this.annee!='' && this.annee.length ==2  ){
      this.fabButton = "c-fab-img2";
    }else{
      this.fabButton = "c-fab";
    }

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
    if (this.pseudo != '' && this.invalidInput =='') {
      this.step += 0.2;
      this.ref.detectChanges();
      this.slideNext();
       this.fabButton ="c-fab"
    }
  }

  genderSlide() {
    if (this.physicalParam.taille !== 0 && this.physicalParam.poids !== 0) {
      this.step =0.6;
      this.ref.detectChanges();
      this.slideNext();
      this.fabButton = "c-fab-img";
    }
  }

  toDoString(val){
    return val.toString();
  }
  physicSlide() {
    if (this.physicalParam.taille !== 0 && this.physicalParam.poids !== 0) {
      this.step += 0.2;
      this.ref.detectChanges();
      this.slideNext();
      this.fabButton="c-fab";
    }
  }

  slideNext() {
    this.sliderComp.lockSwipes(false);
    this.sliderComp.slideNext();
    this.sliderComp.lockSwipes(true);
  }

  async saveOnBoarding() {
    this.sessionNowService.presentLoading();

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
      activitesPratiquees: this.activitesList ? this.activitesList : '',
      userName: this.pseudo,
      physique: this.physicalParam ? this.physicalParam : '',
      niveau: 0,
      metrics: table,
      friends: [],
      exp: 0,
      avatar: this.pictureURL
        ? this.pictureURL
        : 'https://img.icons8.com/ios-filled/50/000000/gender-neutral-user.png',
    };
    // const loading = await this.loadingController.create({
    //   message: 'Veuillez patienter...',
    //   duration: 2000,
    // });
    // await loading.present();
    this.sessionNowService.dissmissLoading();
    this.userService.updateUser(this.user);

    // const { role, data } = await loading.onDidDismiss();

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
    if(this.physicalParam.poids && this.physicalParam.taille){
      this.fabButton ="c-fab-img";
    }else{
      this.fabButton ="c-fab";
    }
  }

  choiceSex(event) {
    this.sex = event;
    if(this.sex){
      this.fabButton ="c-fab-img";
    }else{
      this.fabButton="c-fab";
    }

  }

  eventActivite(event) {
    this.activitesList = event;
    if(this.activitesList){
      this.fabButton = 'c-fab-img';
    }else{
      this.fabButton = 'c-fab';
    }
  }

  validate() {
    this.sliderComp.lockSwipeToPrev(true);
    this.sliderComp.lockSwipes(true);
    if (this.activitesList) {
      this.step += 0.2;
      this.ref.detectChanges();
    }
    this.saveOnBoarding();
  }

  retour() {
    this.presentAlertConfirm();
  }
  parseIntValue(value){
    return parseInt(value);
  }
}
