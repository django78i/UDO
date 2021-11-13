import {
  AfterContentChecked,
  AfterViewInit,
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
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  IonCheckbox,
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
  ban: any = 'assets/banner/blackBanner.svg';
  title: BehaviorSubject<any> = new BehaviorSubject(null);
  @ViewChild('swiper') swiper: SwiperComponent;
  @Output() champ: EventEmitter<any> = new EventEmitter();
  @Input() user: any;

  bannieres = [
    {
      color: '#19191C',
      url: 'assets/banner/blackBanner.svg',
    },
    {
      color: '#EE2E6C',
      url: 'assets/banner/redBanner.svg',
    },
    {
      color: '#2DB681',
      url: 'assets/banner/greenBanner.svg',
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
  @ViewChildren('checkBanniere') checkBanniere: QueryList<IonCheckbox>;

  constructor(
    private modalCtrl: ModalController,
    public fb: FormBuilder,
    public popoverController: PopoverController,
    public elemRef: ElementRef,
    public champService: ChampionnatsService,
    public toastController: ToastController,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.initForm();
    setTimeout(() => {
      this.loading = false;
    }, 1000);
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
      name: [''],
    });
  }

  add() {
    this.weekCount += 1;
  }

  sub() {
    this.weekCount != 0
      ? (this.weekCount -= 1)
      : (this.weekCount = this.weekCount);
  }

  addSeanceWeek() {
    this.seanceWeekCount += 1;
  }

  privacy() {
    this.private.privacy = !this.private.privacy;
    this.private.type = this.private.privacy ? 'Network' : 'Friends&Familly';
  }

  subSeanceWeek() {
    this.seanceWeekCount != 0
      ? (this.seanceWeekCount -= 1)
      : (this.seanceWeekCount = this.seanceWeekCount);
  }

  change(ev) {
    this.maxPlayer = !this.maxPlayer;
    this.range = ev.detail.checked ? { lower: 40, upper: 60 } : undefined;
  }

  getBan(ev) {
    this.ban = ev;
  }

  onKey() {
    const val = this.formChamp.get('name').value;
    this.title.next(val);
  }

  slideNext(data) {
    this.sliderPage = data;
    this.swiper.swiperRef.slideNext();
  }

  changement(ev) {
    this.range = ev.detail.value;
  }

  focused(ev, index) {
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
    console.log(event);
    this.friendsList = event;
  }

  nextFriends() {
    this.champService.matchUser(this.range, this.activitesList);
    this.slideNext('amis');
  }

  async saveChamp(ev) {
    this.user = await this.userService.getCurrentUser();
    const user = {
      avatar: this.user.avatar,
      etat: 'prêt',
      userName: this.user.userName,
      niveau: this.user.niveau,
      uid: this.user.uid,
    };
    console.log(this.friendsList);
    this.friendsList.push(user);
    const champ = {
      dateCreation: new Date(),
      dateDemarrage: moment(new Date()).add(7, 'days').toDate(),
      banniere: this.ban,
      journeeTotale: this.seanceWeekCount * this.weekCount,
      name: this.formChamp.get('name').value,
      dureeMax: this.weekCount,
      status: 'en attente',
      seanceByWeek: this.seanceWeekCount,
      niveauMax: this.range ? this.range.upper : '',
      niveauMin: this.range ? this.range.lower : '',
      activites: this.activitesList,
      createur: {
        name: this.user.userName,
        uid: this.user.uid,
        avatar: user.avatar,
      },
      type: this.private.type,
      participants: this.friendsList,
      nbParticipants: this.friendsList?.length,
    };
    console.log(champ);
    this.champService.createChampionnat(champ);
    this.modalCtrl.dismiss();
    this.presentToast();
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
