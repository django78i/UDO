import {
  AfterContentChecked,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import moment from 'moment';
import { ChallengesService } from 'src/app/services/challenges.service';
import { SessionNowService } from 'src/app/services/session-now-service.service';
import { AddContenuComponent } from 'src/app/session-now/add-contenu/add-contenu.component';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-create-chall-pop-up',
  templateUrl: './create-chall-pop-up.component.html',
  styleUrls: ['./create-chall-pop-up.component.scss'],
})
export class CreateChallPopUpComponent implements OnInit, AfterContentChecked {
  challTitle: string;
  challDescription: string;
  @Input() user: any;
  config: SwiperOptions = {
    slidesPerView: 1,
    allowTouchMove: false,
  };
  sliderPage: any;

  banniere = {
    color: '#000000',
  };
  weekCount = 0;
  @ViewChild('swiper') swiper: SwiperComponent;
  inputLength = 20;
  activitesList = [];

  filters = [
    {
      name: 'Durée',
      metric: 'H',
    },
    {
      name: 'Calories',
      metric: 'KCAL',
    },
    {
      name: 'Distance',
      metric: 'KM',
    },
    {
      name: 'Steps',
      metric: 'pas',
    },
  ];

  config2: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 10,
  };

  @ViewChild('swiper2') swiper2: SwiperComponent;
  indice: number = 0;

  metricChoice: any;
  image: any;
  objectifs: any;
  maxPlayer: number;
  dateDemarrage: any;
  icon: any;
  friendsList: any;
  constructor(
    public modalCtl: ModalController,
    public challService: ChallengesService,
    public sessionNowService: SessionNowService
  ) {}

  ngOnInit() {
    this.indice = 0;
    this.metricChoice = this.filters[0];

    console.log(this.banniere);
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }

    if (this.swiper2) {
      this.swiper2.updateSwiper({});
    }
  }

  changeDescription(ev) {
    this.challDescription = ev.detail.value;
  }

  changeTitle(ev) {
    this.challTitle = ev.detail.value;
    const length = ev.detail.value.length;
    console.log(length);
    this.inputLength = 20 - Number(length);
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

  add() {
    this.weekCount += 1;
  }

  nextFriends() {
    this.slideNext('amis');
  }

  publier(ev) {
    const dateFin = moment(this.dateDemarrage)
      .add(this.weekCount, 'weeks')
      .toDate();
    const user = {
      avatar: this.user.avatar,
      etat: 'prêt',
      userName: this.user.userName,
      niveau: this.user.niveau,
      uid: this.user.uid,
    };
    this.friendsList.push(user);

    const challenge = {
      banniereColor: this.banniere.color,
      banniereImage: this.image ? this.image : '',
      name: this.challTitle,
      description: this.challDescription,
      metric: this.metricChoice,
      dateDemarrage: this.dateDemarrage,
      dateFin: dateFin,
      participantsMax: this.maxPlayer,
      activitiesList: this.activitesList,
      objectifs: this.objectifs,
      duree: this.weekCount,
      status: 'en attente',
      completion: {
        value: 0,
        percent: '0',
      },
      participants: this.friendsList ? this.friendsList : '',
      icon: this.icon,
      dateCreation: new Date(),
    };
    this.challService.createChallenge(challenge);
    this.sessionNowService.show('challenge créé', 'success');
    this.modalCtl.dismiss();
    console.log(challenge);
  }

  objectifChoice(ev) {
    this.objectifs = ev.detail.value;
  }

  playerMax(ev) {
    this.maxPlayer = ev.detail.value;
  }

  dateChoise(ev) {
    this.dateDemarrage = ev.detail.value;
  }

  sub() {
    this.weekCount != 1
      ? (this.weekCount -= 1)
      : (this.weekCount = this.weekCount);
  }

  slideNext(data) {
    this.sliderPage = data;
    this.swiper.swiperRef.slideNext();
  }

  async clickFilter(filter: string, i) {
    this.indice = i;
    this.metricChoice = filter;
    console.log(i, this.metricChoice);
  }

  async addContenu() {
    console.log('addContenu');
    const type = 'PNG';
    const modal = await this.modalCtl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
      componentProps: {
        type: type,
      },
    });
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
      this.image = data.data != 'Modal Closed' ? data.data : null;
    });
    return await modal.present();
  }

  async addIcon() {
    console.log('addContenu');
    const modal = await this.modalCtl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
      this.icon = data.data != 'Modal Closed' ? data.data : null;
    });
    return await modal.present();
  }

  close() {
    this.modalCtl.dismiss();
  }
}
