import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import moment from 'moment';
import { Observable } from 'rxjs';
import { takeLast, tap } from 'rxjs/operators';
import { ChallengesService } from '../services/challenges.service';
import { UserService } from '../services/user-service.service';

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

  constructor(
    private navCtl: NavController,
    public userService: UserService,
    public challService: ChallengesService,
    public route: ActivatedRoute,
    public ref: ChangeDetectorRef,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().then((user) => {
      this.user = user;
      const uid = this.route.snapshot.params['id'];
      this.challService.getChallenge(uid);
      this.challengeObs$ = this.challService.singleChallSub$.pipe(
        tap((chall) => {
          if (chall) {
            this.challenge = chall;
            this.startDate = moment(this.challenge.dateDemarrage).fromNow();
            console.log(this.challenge);
            this.userEncours = this.challenge.participants.find(
              (part) => part.uid == this.user.uid
            );
            this.ref.detectChanges();
          }
        })
      );
    });
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

  participer(ev) {
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

  seanceNow() {
    localStorage.setItem('challengeId', this.challenge.uid);

    const challInfo: NavigationExtras = {
      queryParams: {
        type: 'Challenge',
        competitionName: this.challenge.name,
        competitionId: this.challenge.uid,
        challengeMetric: this.challenge.metric.metric,
        challengeStatus: this.challenge.completion.value,
      },
    };
    this.navCtl.navigateForward('session-now', challInfo);
  }

  close() {
    this.navCtl.navigateBack('/tabs/tab3');
  }
}
