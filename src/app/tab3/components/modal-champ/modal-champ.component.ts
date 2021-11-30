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
  ModalController,
  NavController,
  NavParams,
} from '@ionic/angular';
import moment from 'moment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FriendPageListComponent } from 'src/app/components/friend-page-list/friend-page-list.component';
import { ChallengesService } from 'src/app/services/challenges.service';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { UserService } from 'src/app/services/user-service.service';

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
  selector: 'app-modal-champ',
  templateUrl: './modal-champ.component.html',
  styleUrls: ['./modal-champ.component.scss'],
})
export class ModalChampComponent implements OnInit, AfterViewInit {
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

  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    public champService: ChampionnatsService,
    public navCtl: NavController,
    public ref: ChangeDetectorRef,
    public router: Router,
    public navParam: NavParams,
    public userService: UserService,
    public challService: ChallengesService
  ) {}

  ngOnInit() {
    console.log('modail', this.navParam.data);
    const uid = this.navParam.data.champId;
    this.entryData = this.navParam.data.entryData;
    this.userService.getCurrentUser().then((user) => {
      console.log(user)
      this.user = user;
      if (this.entryData == "Championnat") {
        this.champService.getChampionnat(uid);
        this.championnat$ = this.champService.singleChampSub$.pipe(
          tap((champ) => {
            if (champ) {
              console.log(champ);
              this.championnat = champ;
              this.participantsList = this.championnat.participants.slice(0, 4);
              this.userEncours = this.championnat.participants.find(
                (part) => part.uid == this.user.uid
              );
            }
          })
        );
      } else {
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
      }
    });
  }

  ngAfterViewInit() {}

  close() {
    this.modalCtrl.dismiss();
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

    this.ref.detectChanges();
    console.log(final);
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
        },
      };
    }
    this.navCtl.navigateForward('session-now', competInfo);
  }

  async addFriend(ev) {
    if (ev == true) {
      console.log(this.championnat);
      const modal = await this.modalCtrl.create({
        component: FriendPageListComponent,
        componentProps: {
          user: this.user,
          competition: this.championnat,
        },
      });
      modal.onDidDismiss().then((data: any) => {
        this.champService.getChampionnat(this.championnat.uid);
      });
      return await modal.present();
    }
  }
}
