import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
} from '@ionic/angular';
import moment from 'moment';
import { ChampionnatsService } from 'src/app/services/championnats.service';

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

  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    public champService: ChampionnatsService,
    public navCtl: NavController,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(this.user);
    this.participantsList = this.championnat.participants.slice(0, 4);
    this.userEncours = this.championnat.participants.find(
      (part) => part.uid == this.user.uid
    );
  }

  ngAfterViewInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  participer() {
    const index = this.championnat.participants.findIndex(
      (ind) => ind.uid == this.user.uid
    );
    this.championnat.participants[index].etat = 'prêt';
    console.log(this.championnat);
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
        this.loadChamp();
      }
      console.log(dat);
    });
    await alert.present();
  }

  startChamp() {
    const warning = this.championnat.participants.some(
      (part: any) => part.etat == 'en attente'
    );
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
    this.ref.detectChanges();
    console.log(final);
  }

  seanceNow() {
    localStorage.setItem('championnatUid', this.championnat.uid);
    this.navCtl.navigateForward('session-now');
    this.modalCtrl.dismiss();
  }
}
