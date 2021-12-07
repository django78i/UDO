import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { takeLast, tap } from 'rxjs/operators';
import { FriendPageListComponent } from '../components/friend-page-list/friend-page-list.component';
import { ChallengesService } from '../services/challenges.service';
import { MusicFeedService } from '../services/music-feed.service';
import { UserService } from '../services/user-service.service';
import { AddContenuComponent } from '../session-now/add-contenu/add-contenu.component';

@Component({
  selector: 'app-challenges-page',
  templateUrl: './challenges-page.page.html',
  styleUrls: ['./challenges-page.page.scss'],
})
export class ChallengesPagePage implements OnInit {
  segmentValue = 'resume';
  user: any;
  challenge: any;
  userEncours: any;
  challenge$: Observable<any>;
  loading = false;
  startDate: any;

  challengeObs$: Observable<any>;
  text: string;
  picture: any;
  boole: Boolean = false;
  feed: any;
  lastVisible: any;
  pictureUrl: string;
  competition = 'challenge';
  @ViewChild('inputFeed') inputFeed: IonInput;
  admin: boolean = false;
  constructor(
    private navCtl: NavController,
    public userService: UserService,
    public challService: ChallengesService,
    public route: ActivatedRoute,
    public ref: ChangeDetectorRef,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public feedService: MusicFeedService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().then((user) => {
      this.user = user;
      this.http
        .get<any[]>('../../../assets/mocks/admin.json')
        .pipe(
          tap(
            (ad) =>
              (this.admin = ad.some((userAdmin) => userAdmin == this.user.uid))
          )
        )
        .subscribe();
      const uid = this.route.snapshot.params['id'];
      this.challService.getChallenge(uid);
      this.challengeObs$ = this.challService.singleChallSub$.pipe(
        tap((chall) => {
          if (chall) {
            this.challenge = chall;
            this.startDate = moment(this.challenge.dateDemarrage).fromNow();
            this.getFeedChallenge(uid);
            console.log(this.challenge);
            this.userEncours = this.challenge.participants.find(
              (part) => part.uid == this.user.uid
            );
            console.log(this.userEncours, this.challenge, this.startDate);
            this.ref.detectChanges();
          }
        })
      );
    });
  }

  async getFeedChallenge(uid) {
    const feedPrime = await this.feedService.feedQuery(uid, this.competition);
    console.log(feedPrime);
    this.feed = feedPrime.table;
    this.lastVisible = feedPrime.last;
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
    const champ = this.challenge.participants.map((part: any, i) => ({
      ...part,
      seance: 0,
      value: 0,
    }));
    const final = champ.filter((ch) => ch.etat != 'en attente');
    this.challenge.participants = final;
    this.challService.updateChall({
      ...this.challenge,
      dateFin: this.challenge.dateFin.toDate(),
    });
    this.loading = false;
    this.challService.getChallenge(this.challenge.uid);
    this.ref.detectChanges();
    console.log(final);
  }

  participer() {
    this.loading = true;

    const index = this.challenge.participants.findIndex(
      (ind) => ind.uid == this.user.uid
    );
    let user: any;
    if (!this.userEncours) {
      user = {
        ...this.user,
        seance: 0,
        value: 0,
        etat: 'prêt',
      };
    }
    index != -1
      ? (this.challenge.participants[index].etat = 'prêt')
      : this.challenge.participants.push(user);
    this.ref.detectChanges();
    console.log(this.challenge);
    this.challService.updateChall(this.challenge);
    this.challService.getChallenge(this.challenge.uid);

    this.loading = false;
  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
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
        this.loadChall();
      } else {
        this.loading = false;
      }
      console.log(dat);
    });
    await alert.present();
  }

  async addFriend() {
    console.log(this.challenge);
    const modal = await this.modalCtrl.create({
      component: FriendPageListComponent,
      componentProps: {
        user: this.user,
        competition: this.challenge,
        type: 'challenges',
      },
    });
    modal.onDidDismiss().then((data: any) => {
      this.challService.getChallenge(this.challenge.uid);
    });
    return await modal.present();
  }

  seanceNow() {
    localStorage.setItem('challengeId', this.challenge.uid);

    const challInfo: NavigationExtras = {
      queryParams: {
        type: 'Challenge',
        competitionName: this.challenge.name,
        competitionId: this.challenge.uid,
        challengeMetric: this.challenge.metric.metric,
        challengeStatus: this.challenge.completion.value,
        challengeIcon: this.challenge.icon,
      },
    };
    this.navCtl.navigateForward('session-now', challInfo);
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
      challenge: this.challenge.uid,
      competitionType: this.competition,
      challIcon: this.challenge.icon,
      competitionName: this.challenge.name,
      competitionId: this.challenge.uid,
    };
    console.log(post);
    this.feedService.sendPost(post);
    this.feedReinit();
  }

  async feedReinit() {
    this.feed = [];
    console.log(this.feed);
    const feedRefresh = await this.feedService.feedQuery(
      this.challenge.uid,
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

  close() {
    this.navCtl.navigateBack('/tabs/tab3');
  }
}
