import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChallengesService } from 'src/app/services/challenges.service';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { UserService } from 'src/app/services/user-service.service';
import { ModalChampComponent } from 'src/app/tab3/components/modal-champ/modal-champ.component';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-competitions-list',
  templateUrl: './competitions-list.component.html',
  styleUrls: ['./competitions-list.component.scss'],
})
export class CompetitionsListComponent {
  segmentValue: string = 'championnats';
  @Input() segmentSelected: string;

  championnatNetwork: any[] = [];
  championnatsFiltered: any[];
  filter: string;
  subscription: Subscription;
  challenges: any[] = [];
  challengesFilered: any[];
  lastVisibleChamp: any;
  lastVisibleChall: any;

  loading: boolean = true;
  template: any[] = ['', '', '', '', ''];
  constructor(
    public modalCtrl: ModalController,
    public champService: ChampionnatsService,
    public ref: ChangeDetectorRef,
    public router: Router,
    public navCtl: NavController,
    public zone: NgZone,
    public challService: ChallengesService,
    private userService: UserService
  ) {}

  ionViewDidEnter() {
    console.log('state');
    this.champService.getChampionnatNetwork().then((r) => {
      console.log(r);
      this.lastVisibleChamp = r;
    });
    this.challService.getChallengesList().then((r) => {
      this.lastVisibleChall = r;
    });

    this.champService.champNetWorkList$
      .pipe(
        tap((r) => {
          if (r) {
            console.log(r);
            this.championnatNetwork.push(r);
          }
          this.loading = false;
        })
      )
      .subscribe();

    this.challService.challengesList$
      .pipe(
        tap((r) => {
          console.log(r);
          if (r) {
            this.challenges.push(r);
          }
        })
      )
      .subscribe();
  }

  // charger plus de données dans le feed
  async loadData(event) {
    const feedPlus =
      this.segmentValue == 'championnats'
        ? await this.addDdataChamp(this.lastVisibleChamp)
        : await this.addDataChallenges(this.lastVisibleChall);
    setTimeout(() => {
      event.target.complete();
      const lastVisible = feedPlus;
      if (
        lastVisible &&
        ((this.segmentValue == 'championnats' &&
          lastVisible.data() <= this.championnatNetwork.length) ||
          (this.segmentValue == 'challenges' &&
            lastVisible.data() <= this.challenges.length))
      ) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async addDataChallenges(last): Promise<any> {
    return await this.challService.addChallenges(last);
  }

  async addDdataChamp(last): Promise<any> {
    console.log(last);
    return await this.champService.addNetWork(last);
  }

  search(ev) {
    this.filter = ev.detail.value;
    const filterChamp = this.championnatNetwork.filter((champ) =>
      champ.name.toLowerCase().includes(ev.detail.value.toLowerCase().trim())
    );
    const filterChallenge = this.challenges.filter((chall) =>
      chall.name.toLowerCase().includes(this.filter.toLowerCase().trim())
    );
    console.log(filterChallenge);
    if (this.filter != '') {
      this.challengesFilered = filterChallenge;
      this.championnatsFiltered = filterChamp;
    } else {
      this.challengesFilered = undefined;
      this.championnatsFiltered = undefined;
    }
  }

  viewChange(ev) {
    this.segmentValue = ev.detail.value;
  }

  async navigateChallenge(ev, chall) {
    console.log('ici');
    const modal = await this.modalCtrl.create({
      component: ModalChampComponent,
      componentProps: {
        champId: ev.uid,
        entryData: 'challenges',
        competition: ev,
      },
    });
    return await modal.present();
  }

  async navigateChampionnat(champ) {
    const user = await this.userService.getCurrentUser();
    console.log(champ);
    const position =
      champ.participants.findIndex((champ) => champ.uid == user.uid) + 1;

    const participantsList = champ.participants.slice(0, 4);

    const modal = await this.modalCtrl.create({
      component: ModalChampComponent,
      componentProps: {
        champId: champ.uid,
        entryData: 'championnats',
        competition: champ,
        position: position,
        participantsList: participantsList,
        userEncours: user,
      },
    });
    return await modal.present();
  }

  close() {
    this.navCtl.navigateBack('tabs/tab3');
  }
}
