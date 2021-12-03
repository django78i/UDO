import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import {
  AlertController,
  IonInput,
  ModalController,
  NavController,
} from '@ionic/angular';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';
import moment from 'moment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { UserService } from 'src/app/services/user-service.service';
import { FriendPageListComponent } from '../components/friend-page-list/friend-page-list.component';
import { MusicFeedService } from '../services/music-feed.service';
import { AddContenuComponent } from '../session-now/add-contenu/add-contenu.component';

interface ChampionnatNav {
  type: string;
  competitionName?: string;
  competitionId?: string;
  challengeStatus?: number;
  challengeMetric?: string;
}

interface Championnat {
  uid: string;
  dateCreation: Date;
  dateDemarrage: Date;
  banniere: string;
  name: string;
  dureeMax: number;
  status: string;
  seanceByWeek: number;
  niveauMax: number;
  niveauMin: number;
  activites: [];
  createur: string;
  type: string;
  participants: any[];
  nbParticipants: string;
  dateFin?: any;
  semaineEnCours: number;
  journeeTotale: number;
}

@Component({
  selector: 'app-championnat',
  templateUrl: './championnat.page.html',
  styleUrls: ['./championnat.page.scss'],
})
export class ChampionnatPage implements OnInit {
  segmentValue = 'resume';
  participantsList: any[];
  userEncours: any;
  championnat: any;
  user: any;
  loading = false;
  championnat$: Observable<any>;
  text: string;
  picture: any;
  boole: Boolean = false;
  feed: any;
  lastVisible: any;
  pictureUrl: string;
  competition = 'championnat';
  @ViewChild('inputFeed') inputFeed: IonInput;

  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    public champService: ChampionnatsService,
    public navCtl: NavController,
    public ref: ChangeDetectorRef,
    public route: ActivatedRoute,
    public userService: UserService,
    public feedService: MusicFeedService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().then((user) => {
      this.user = user;
      const uid = this.route.snapshot.params['id'];
      this.champService.getChampionnat(uid);
      this.championnat$ = this.champService.singleChampSub$.pipe(
        tap((champ) => {
          console.log(champ, this.user);
          this.championnat = champ;
          this.getFeedChampionnat(this.championnat.uid);
          this.participantsList = this.championnat.participants.slice(0, 4);
          this.userEncours = this.championnat.participants.find(
            (part) => part.uid == this.user.uid
          );
        })
      );
    });
  }

  ngAfterViewInit() {}

  async getFeedChampionnat(uid) {
    const feedPrime = await this.feedService.feedQuery(uid, this.competition);
    console.log(feedPrime);
    this.feed = feedPrime.table;
    this.lastVisible = feedPrime.last;
  }

  close(ev) {
    this.navCtl.navigateBack('/tabs/tab3');
  }

  participer(ev) {
    this.loading = true;

    const index = this.championnat.participants.findIndex(
      (ind) => ind.uid == this.user.uid
    );
    this.championnat.participants[index].etat = 'prêt';
    this.userEncours.etat = 'prêt';
    this.ref.detectChanges();
    console.log(this.championnat);
    this.champService.updateChamp(this.championnat);
    this.loading = false;
  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
    console.log(this.segmentValue);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention!',
      message:
        'des utilisateurs sont en attente, voulez démarrez le championnat ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Démarrer',
          role: 'confirm',
          handler: () => {
            console.log('Confirm Okay');
          },
        },
      ],
    });
    alert.onDidDismiss().then((dat) => {
      if (dat.role == 'confirm') {
        this.loadChamp();
      } else {
        this.loading = false;
      }
      console.log(dat);
    });
    await alert.present();
  }

  async feedReinit() {
    this.feed = [];
    console.log(this.feed);
    const feedRefresh = await this.feedService.feedQuery(
      this.championnat.uid,
      this.competition
    );
    console.log(feedRefresh);
    this.feed = feedRefresh.table;
    this.lastVisible = feedRefresh.last;
    if (this.inputFeed) {
      this.inputFeed.value = null;
    }
    this.picture = null;
    this.pictureUrl = null;
    this.boole = false;
    this.inputFeed.value = null;

  }

  startChamp() {
    const warning = this.championnat.participants.some(
      (part: any) => part.etat == 'en attente'
    );
    this.loading = true;
    warning ? this.presentAlertConfirm() : this.loadChamp();
  }

  loadChamp() {
    console.log('load');
    this.championnat.status = 'en cours';
    this.championnat.semaineEnCours = 1;
    this.championnat.dateFin = moment(new Date()).add(
      this.championnat.dureeMax,
      'weeks'
    );
    const champ = this.championnat.participants.map((part: any, i) => ({
      ...part,
      journeeEnCours: 0,
      points: 0,
      bonus: 0,
    }));
    const final = champ.filter((ch) => ch.etat != 'en attente');
    this.championnat.participants = final;
    this.champService.updateChamp({
      ...this.championnat,
      dateFin: this.championnat.dateFin.toDate(),
    });
    this.loading = false;

    this.champService.getChampionnat(this.championnat.uid);
    console.log(final);
  }

  seanceNow() {
    localStorage.setItem('championnatUid', this.championnat.uid);

    const champInfo: NavigationExtras = {
      queryParams: {
        championnatType: this.championnat.type,
        type: 'Championnat',
        competitionName: this.championnat.name,
        competitionId: this.championnat.uid,
      },
    };
    this.navCtl.navigateForward('session-now', champInfo);
  }

  deletePhoto() {
    this.picture = null;
  }

  async savePhoto(photo) {
    console.log(photo);
    const storage = getStorage();
    const storageRef = ref(storage, `images/${new Date()}`);
    const uploadTask = uploadString(storageRef, photo, 'data_url');
    return await uploadTask;
  }

  inputRead(event) {
    console.log(event.detail.value);
    this.text = event.detail.value;
  }

  async send() {
    let photo;
    if (this.picture) {
      const tof = await this.savePhoto(this.picture);
      photo = await getDownloadURL(tof.ref);
    }

    const post = {
      userId: this.user.uid,
      type: 'picture',
      startDate: new Date(),
      reactions: [],
      photo: photo ? photo : '',
      mode: 'public',
      isLive: false,
      comment: this.text,
      activity: '',
      championnat: this.championnat.uid,
      competitionType: this.competition,
      competitionName: this.championnat.name,
      competitionId: this.championnat.uid,
      championnatType: this.championnat.type,
    };
    console.log(post);
    this.feedService.sendPost(post);
    this.feedReinit();
  }

  async addContenu() {
    const modal = await this.modalCtrl.create({
      component: AddContenuComponent,
      cssClass: 'my-custom-contenu-modal',
    });
    modal.onDidDismiss().then((data: any) => {
      this.picture = data.data !== 'Modal Closed' ? data.data : null;
    });
    return await modal.present();
  }

  async addFriend() {
    console.log(this.championnat);
    const modal = await this.modalCtrl.create({
      component: FriendPageListComponent,
      componentProps: {
        user: this.user,
        competition: this.championnat,
        type: 'championnat',
      },
    });
    modal.onDidDismiss().then((data: any) => {
      this.champService.getChampionnat(this.championnat.uid);
    });
    return await modal.present();
  }
}
