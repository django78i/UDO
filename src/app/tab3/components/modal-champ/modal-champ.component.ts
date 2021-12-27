import { HttpClient } from '@angular/common/http';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  AlertController,
  IonInput,
  ModalController,
  NavController,
  NavParams,
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
import { FriendPageListComponent } from 'src/app/components/friend-page-list/friend-page-list.component';
import { ChallengesService } from 'src/app/services/challenges.service';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { MusicFeedService } from 'src/app/services/music-feed.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { UserService } from 'src/app/services/user-service.service';
import { AddContenuComponent } from 'src/app/session-now/add-contenu/add-contenu.component';

interface Notification {
  type: string;
  linkId: string;
  users: any;
  competitionName: string;
  dateCreation: Date;
  senderId: string;
  challIcon?: string;
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
  createur: any;
  type: string;
  participants: any[];
  nbParticipants: string;
  dateFin?: any;
  semaineEnCours: number;
  journeeTotale: number;
}

@Component({
  animations: [
    trigger('flyInOut', [
      transition('* => void', [animate(100)]),
      transition('void => *', [animate(100)]),
    ]),
  ],

  selector: 'app-modal-champ',
  templateUrl: './modal-champ.component.html',
  styleUrls: ['./modal-champ.component.scss'],
})
export class ModalChampComponent implements OnInit {
  @Input() championnat: Championnat;
  @Input() user: any;
  segmentValue = 'resume';
  participantsList: any[];
  userEncours: any;
  loading = false;
  championnat$: Observable<any>;
  entryData: string;

  challenge: any;
  challenge$: Observable<any>;
  startDate: any;

  challengeObs$: Observable<any>;
  @ViewChild('inputFeed') inputFeed: IonInput;
  text: any;
  lastVisible: any;
  picture: any;
  pictureUrl: any;
  boole: Boolean = false;
  feed: any;
  admin: boolean = false;
  pourcentage: number = 0;
  loadingComp: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    public champService: ChampionnatsService,
    public navCtl: NavController,
    public ref: ChangeDetectorRef,
    public router: Router,
    public navParam: NavParams,
    public userService: UserService,
    public challService: ChallengesService,
    public feedService: MusicFeedService,
    public http: HttpClient,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    console.log('modail', this.navParam.data, this.entryData);
    this.entryData = this.navParam.data.entryData;
  }

  ionViewWillEnter() {
    this.getCompetition();
  }

  async getCompetition() {
    this.user = await this.userService.getCurrentUser();

    if (this.entryData == 'championnat') {
      this.champService.getChampionnat(this.navParam.data.champId);
      this.championnat$ = this.champService.singleChampSub$.pipe(
        tap((champ) => {
          if (champ) {
            console.log(champ);
            this.championnat = champ;
            this.getFeedChampionnat(this.championnat.uid);

            this.participantsList = this.championnat.participants.slice(0, 4);
            this.userEncours = this.championnat.participants.find(
              (part) => part.uid == this.user.uid
            );
          }
        })
      );
    } else {
      this.challService.getChallenge(this.navParam.data.champId);
      this.challengeObs$ = this.challService.singleChallSub$.pipe(
        tap((chall) => {
          if (chall) {
            this.challenge = chall;
            console.log(this.entryData);
            this.getFeedChampionnat(this.challenge.uid);
            this.pourcentage = Number(
              this.challenge.completion.value / this.challenge.objectifs
            );

            this.userEncours = this.challenge.participants.find(
              (part) => part.uid == this.user.uid
            );
            this.startDate = moment(this.challenge.dateDemarrage).fromNow();
            console.log(this.challenge);
            this.ref.detectChanges();
          }
        })
      );
    }

    this.http
      .get<any[]>('../../../../assets/mocks/admin.json')
      .pipe(
        tap(
          (ad) =>
            (this.admin = ad.some((userAdmin) => userAdmin == this.user.uid))
        )
      )
      .subscribe();
    this.loadingComp = false;
    this.ref.detectChanges();
  }

  async getFeedChampionnat(uid) {
    const feedPrime = await this.feedService.feedQuery(
      uid,
      this.entryData.toLowerCase()
    );
    console.log(feedPrime);
    this.feed = feedPrime.table;
    this.lastVisible = feedPrime.last;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  participer(ev: string) {
    this.loading = true;

    const index =
      ev == 'challenge'
        ? this.challenge.participants.findIndex(
            (ind) => ind.uid == this.user.uid
          )
        : this.championnat.participants.findIndex(
            (ind) => ind.uid == this.user.uid
          );
    let user: any;
    if (!this.userEncours) {
      user =
        ev == 'challenge'
          ? {
              ...this.user,
              seance: 0,
              value: 0,
              etat: 'prêt',
            }
          : {
              avatar: this.user.avatar,
              etat: 'prêt',
              niveau: this.user.niveau,
              points: 0,
              journeeEnCours: 0,
              bonus: 0,
              uid: this.user.uid,
            };
    }
    ev == 'challenge'
      ? this.participerChallengeEnAttente(this.challenge, index, user)
      : this.participerChampionnat(this.championnat, index, user);
    this.ref.detectChanges();
    console.log(this.challenge);

    this.loading = false;
  }

  participerChallengeEnAttente(challenge, index, user): void {
    const chall = challenge;

    index = !-1
      ? (chall.participants[index].etat = 'prêt')
      : chall.participants.push(user);

    this.challService.updateChall(chall);
    this.challService.getChallenge(chall.uid);
  }

  participerChampionnat(championnat, index, user): void {
    const champ = championnat;
    index = !-1
      ? (champ.participants[index].etat = 'prêt')
      : champ.participants.push(user);

    this.challService.updateChall(champ);
    this.challService.getChallenge(champ.uid);
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

  startChamp(ev) {
    const warning = this.championnat.participants.some(
      (part: any) => part.etat == 'en attente'
    );
    this.loading = true;
    warning ? this.presentAlertConfirm() : this.loadChamp();
  }

  startChall(ev) {
    const warning = this.challenge.participants.some(
      (part: any) => part.etat == 'en attente'
    );
    this.loading = true;
    warning ? this.presentAlertConfirm() : this.loadChall();
  }

  loadChall() {
    this.loading = true;
    console.log('load');
    this.challenge.status = 'en cours';
    this.challenge.semaineEnCours = 1;
    this.challenge.dateFin = moment(new Date()).add(
      this.challenge.dureeMax,
      'weeks'
    );
    const champ = this.challenge.participants
      .map((part: any, i) => ({
        ...part,
        seance: 0,
        value: 0,
      }))
      .filter((ch) => ch.etat != 'en attente');

    this.sendNotification(champ);
    this.challenge.participants = champ;
    this.challService.updateChall({
      ...this.challenge,
      dateFin: this.challenge.dateFin.toDate(),
    });
    this.loading = false;

    this.ref.detectChanges();
    console.log(champ);
  }

  loadChamp() {
    console.log('load');
    this.championnat.status = 'en cours';
    this.championnat.semaineEnCours = 1;
    this.championnat.dateFin = moment(new Date()).add(
      this.championnat.dureeMax,
      'weeks'
    );

    //initialisation des participants
    const champ = this.championnat.participants
      .map((part: any, i) => ({
        ...part,
        journeeEnCours: 0,
        points: 0,
        bonus: 0,
      }))
      .filter((ch) => ch.etat != 'en attente');

    this.sendNotification(champ);
    this.championnat.participants = champ;
    this.champService.updateChamp({
      ...this.championnat,
      dateFin: this.championnat.dateFin.toDate(),
    });

    this.champService.getChampionnat(this.championnat.uid);
    this.loading = false;
    console.log(champ);
  }

  sendNotification(participants) {
    //liste des users à notifier
    const participantsToNotify = participants
      .filter((ch) => ch.uid != this.user.uid)
      .map((us) => us.uid);
    console.log(participantsToNotify);

    const notification: Notification = {
      type:
        this.entryData == 'championnat'
          ? `démarrage championnat ${this.championnat.type}`
          : 'démarrage challenge',
      linkId: this.championnat.uid,
      users: participantsToNotify,
      challIcon: this.challenge.icon,
      competitionName: this.championnat.name,
      dateCreation: new Date(),
      senderId: this.championnat.createur.uid,
    };
    console.log(notification);
    this.notificationService.createNotifications(notification);
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

    const post: any = {
      userId: this.user.uid,
      type: 'picture',
      startDate: new Date(),
      reactions: [],
      photo: photo ? photo : '',
      mode: 'public',
      isLive: false,
      comment: this.text,
      activity: '',
      challIcon: this.challenge ? this.challenge.icon : '',
      championnatType: this.championnat ? this.championnat.type : '',
      competitionType: this.entryData.toLowerCase(),
      competitionName: this.championnat
        ? this.championnat.name
        : this.challenge.name,
      competitionId: this.championnat
        ? this.championnat.uid
        : this.challenge.uid,
    };

    this.entryData.toLowerCase() == 'championnat'
      ? (post.championnat = this.championnat.uid)
      : (post.challenge = this.challenge.uid);

    console.log(post);
    this.feedService.sendPost(post);
    this.feedReinit();
  }

  async feedReinit() {
    this.feed = [];
    console.log(this.feed, this.challenge);
    const feedRefresh = await this.feedService.feedQuery(
      this.challenge ? this.challenge.uid : this.championnat.uid,
      this.entryData.toLowerCase()
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

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
  }

  seanceNow(ev, type) {
    let competInfo: NavigationExtras;
    if (type == 'championnat') {
      competInfo = {
        queryParams: {
          championnatType: this.championnat.type,
          type: 'Championnat',
          competitionName: this.championnat.name,
          competitionId: this.championnat.uid,
        },
      };
    } else {
      competInfo = {
        queryParams: {
          type: 'Challenge',
          competitionName: this.challenge.name,
          competitionId: this.challenge.uid,
          challengeMetric: this.challenge.metric.metric,
          challengeStatus: this.challenge.completion.value,
          challengeIcon: this.challenge.icon,
        },
      };
    }
    this.navCtl.navigateForward('session-now', competInfo);
  }

  async addFriend() {
    console.log(this.championnat);
    const modal = await this.modalCtrl.create({
      component: FriendPageListComponent,
      componentProps: {
        challIcon: this.challenge?.icon,
        user: this.user,
        competition: this.championnat,
        type: this.entryData.toLowerCase(),
      },
    });
    modal.onDidDismiss().then((data: any) => {
      if (this.entryData == 'Championnat') {
        this.champService.getChampionnat(this.championnat.uid);
      } else {
        this.challService.getChallenge(this.challenge.uid);
      }
    });
    return await modal.present();
  }
}
