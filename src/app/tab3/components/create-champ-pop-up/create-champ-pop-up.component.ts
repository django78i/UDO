import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonCheckbox,
  IonInput,
  IonRange,
  ModalController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import moment from 'moment';
import { UserService } from 'src/app/services/user-service.service';
import { SessionNowService } from 'src/app/services/session-now-service.service';

interface Championnat {
  dateCreation: Date;
  dateDemarrage: Date;
  banniere: string;
  journeeTotale: number;
  name: string;
  dureeMax: number;
  status: string;
  description?: string;
  seanceByWeek: number;
  niveauMax?: number;
  niveauMin?: number;
  activites?: any[];
  createur: any;
  type: string;
  participants?: any[];
  nbParticipants: number;
}

@Component({
  selector: 'app-create-champ-pop-up',
  templateUrl: './create-champ-pop-up.component.html',
  styleUrls: ['./create-champ-pop-up.component.scss'],
})
export class CreateChampPopUpComponent
  implements OnInit, AfterContentChecked, AfterViewInit
{
  formChamp: FormGroup;
  weekCount: number = 2;
  seanceWeekCount: number = 2;
  maxPlayer = false;
  private = {
    privacy: false,
    type: 'Friends&familly',
  };
  ban: any = {
    color: '#19191C',
    url: 'assets/banner/blackBanner.svg',
  };
  title: any;
  @ViewChild('swiper') swiper: SwiperComponent;
  @Output() champ: EventEmitter<any> = new EventEmitter();
  @Input() user: any;

  bannieres = [
    {
      color: '#FCD03B',
      url: 'assets/banner/yellow.svg',
    },
    {
      color: '#F8774D',
      url: 'assets/banner/orange.svg',
    },
    {
      color: '#EE2E6C',
      url: 'assets/banner/redBanner.svg',
    },
    {
      color: '#2DB681',
      url: 'assets/banner/greenBanner.svg',
    },
    {
      color: '#0069D3',
      url: 'assets/banner/blue.svg',
    },
    {
      color: '#6F37C3',
      url: 'assets/banner/violet.svg',
    },

    {
      color: '#19191C',
      url: 'assets/banner/blackBanner.svg',
    },
  ];

  activitesList = [];
  friendsList = [];

  config: SwiperOptions = {
    slidesPerView: 1,
    allowTouchMove: false,
  };
  range: any;
  loading = true;
  sliderPage: any;
  descriptionString: string;
  inputLength: number = 20;

  @ViewChildren('checkBanniere') checkBanniere: QueryList<IonCheckbox>;

  seg: string = 'Friends&Familly';

  constructor(
    private modalCtrl: ModalController,
    public fb: FormBuilder,
    public popoverController: PopoverController,
    public elemRef: ElementRef,
    public champService: ChampionnatsService,
    public toastController: ToastController,
    public userService: UserService,
    public snService: SessionNowService,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.ban;
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngAfterViewInit() {
    const dualRange: any = document.querySelector('#dual-range');
    dualRange.value = { lower: 40, upper: 60 };
  }

  close() {
    this.modalCtrl.dismiss();
  }

  initForm() {
    this.formChamp = this.fb.group({
      nameChamp: ['', Validators.required],
    });
  }

  add(counter) {
    counter == 'week' ? (this.weekCount += 1) : (this.seanceWeekCount += 1);
  }

  sub(counter) {
    if (counter == 'week') {
      this.weekCount != 1
        ? (this.weekCount -= 1)
        : (this.weekCount = this.weekCount);
    } else {
      this.seanceWeekCount != 1
        ? (this.seanceWeekCount -= 1)
        : (this.seanceWeekCount = this.seanceWeekCount);
    }
  }

  privacy() {
    this.private.privacy = !this.private.privacy;
    this.private.type = this.private.privacy ? 'Network' : 'Friends&Familly';
  }

  change(ev) {
    this.maxPlayer = !this.maxPlayer;
    this.range = ev.detail.checked ? { lower: 40, upper: 60 } : undefined;
  }

  getBan(ev) {
    this.ban = ev;
  }

  onKey(ev) {
    this.title = ev.detail.value;
    const length = ev.detail.value.length;
    console.log(length);
    this.inputLength = 20 - Number(length);
  }

  description(ev) {
    this.descriptionString = ev.detail.value;
  }

  slideNext(data) {
    this.sliderPage = data;
    this.swiper.swiperRef.slideNext();
  }

  changement(ev) {
    this.range = ev.detail.value;
  }

  segmentChanged(ev) {
    this.seg = ev.detail.value;
  }

  focused(ev, index) {
    console.log(ev);
    const elemStyle = document.querySelectorAll('.checkZone');
    elemStyle.forEach((elem, i) => {
      index === i
        ? elem.classList.add('check')
        : elem.classList.remove('check');
    });

    this.checkBanniere.map((ban, i) => {
      if (i != index) {
        ban.checked = false;
      }
    });
    this.checkBanniere.get(index).checked.valueOf();
    this.ban = ev;
  }

  eventActivite(event) {
    this.activitesList = event;
  }

  backSlide(ev) {
    this.swiper.swiperRef.slidePrev();
  }

  chooseFriends(event) {
    this.friendsList = event;
  }

  nextFriends() {
    if (this.seanceWeekCount == 0) {
      this.snService.show('erreur : 0 séance par semaine', 'warning');
    } else if (this.weekCount == 0) {
      this.snService.show('erreur : 0 semaine', 'warning');
    } else {
      this.champService.matchUser(this.range, this.activitesList);
      this.slideNext('amis');
    }
  }

  async saveChamp(ev) {
    this.snService.presentLoading();
    this.user = await this.userService.getCurrentUser();
    const userOne = {
      avatar: this.user.avatar,
      etat: 'prêt',
      userName: this.user.userName,
      niveau: this.user.niveau,
      uid: this.user.uid,
    };
    this.friendsList.push(userOne);
    console.log(this.friendsList);
    const champ: Championnat = {
      dateCreation: new Date(),
      dateDemarrage: moment(new Date()).add(7, 'days').toDate(),
      banniere: this.ban,
      journeeTotale: this.seanceWeekCount * this.weekCount,
      name: this.formChamp.get('name').value,
      dureeMax: this.weekCount,
      status: 'en attente',
      description: this.descriptionString ? this.descriptionString : '',
      seanceByWeek: this.seanceWeekCount,
      niveauMax: this.range ? this.range.upper : '',
      niveauMin: this.range ? this.range.lower : '',
      activites: this.activitesList,
      createur: {
        name: this.user.userName,
        uid: this.user.uid,
        avatar: userOne.avatar,
      },
      type: this.seg,
      participants: this.friendsList,
      nbParticipants: this.friendsList?.length,
    };
    console.log(champ);
    this.champService
      .createChampionnat(champ)
      .then(() => {
        this.snService.show('championnat créé', 'success');
        this.snService.dissmissLoading();
      })
      .catch((err) => {
        this.snService.show(
          "une erreur s'est produite, veuillez rééssayer plus tard",
          'warning'
        );
        this.snService.dissmissLoading();
      });
    this.modalCtrl.dismiss();
    // this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Votre championnat a été créé.',
      duration: 2000,
      cssClass: 'toastMode',
    });
    toast.present();
  }
}
