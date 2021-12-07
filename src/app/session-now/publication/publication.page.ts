import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.scss'],
})
export class PublicationPage implements OnInit, OnDestroy {
  /* listActivite = [{ name: 'Corps haut', value: '20', image: 'assets/images/corps-haut.svg' },
  { name: 'Corps bas', value: '100', image: 'assets/images/corps-bas.svg' },
  { name: 'Cardio', value: '20', image: 'assets/images/cardio.svg' },
  { name: 'Explosivité', value: '20', image: 'assets/images/explosivite.svg' },
  { name: 'Souplesse', value: '20', image: 'assets/images/souplesse.svg' },
  { name: 'Gainage', value: '20', image: 'assets/images/gainage.svg' }];*/
  listActivite = [];
  mode = '';
  modeClasse = '';
  demarrage = '';
  modeRow = '';
  valeur = 0;
  subscription: Subscription;
  max: number;
  user: any;
  xpMax: number = 0;
  newxp: number;
  xpNewOnTotal: number;
  xpUserOnTotal: number;
  constructor(
    private router: Router,
    private platform: Platform,
    public userService: UserService
  ) {
    this.subscription = this.platform.backButton.subscribeWithPriority(
      10,
      () => {
        console.log('Handler was called!');
        // this.presentAlertConfirm();
      }
    );
    setInterval(() => {
      if (localStorage.getItem('mode')) {
        if (localStorage.getItem('mode') === 'landscape') {
          this.mode = 'landscape';
          this.modeClasse = 'val-progess-lands';
          this.demarrage = 'c-ion-fab-lands';
          this.modeRow = 'c-row-lands';
        } else {
          this.mode = 'portrait';
          this.modeClasse = 'val-progess';
          this.demarrage = 'c-ion-fab';
          this.modeRow = 'c-row';
        }
      } else {
        this.modeClasse = 'val-progess';
        this.demarrage = 'c-ion-fab';
        this.modeRow = 'c-row';
      }
    }, 100);
    const activite = JSON.parse(localStorage.getItem('activite'));
    if (activite) {
      this.listActivite = activite.details;
      let counter: any = JSON.parse(localStorage.getItem('counter'));
      let time = 0;

      if (counter) {
        let minute = counter.mn;
        let seconde = counter.s;

        let valMinute;
        if (minute) {
          valMinute = minute * 60;
          valMinute += seconde;
          time = valMinute / 60;
          if (time > 15) {
            for (let act of this.listActivite) {
              let val = parseInt(act.value) * time;
              act.value = val.toString();
              this.valeur += parseInt(act.value);
            }
          } else {
            for (let act of this.listActivite) {
              this.valeur += parseInt(act.value);
            }
          }
        } else {
          for (let act of this.listActivite) {
            this.valeur += parseInt(act.value);
          }
        }
      }

      console.log(this.valeur);
    }
  }

  ngOnInit() {
    this.userService.getCurrentUser().then((user) => {
      this.user = user;
      this.max = this.user.niveau * 100;
      if (this.user.exp >= this.max) {
        this.user.niveau += 1;
      } else if (this.user.exp + this.valeur >= this.max) {
        this.user.niveau += 1;
      }
      this.max = this.user.niveau * 100;

      this.user.metrics.forEach((metrics, i) => {
        const metricFormat = (metrics.value =
          metrics.value + Number(this.listActivite[i].value));
        this.xpMax += Number(this.listActivite[i].value);
        return { ...metrics, value: metricFormat };
      });
      this.newxp = this.user.exp + this.xpMax;
      this.xpUserOnTotal = this.user.exp / this.max;
      this.user.exp += this.xpMax;
      this.xpNewOnTotal = this.newxp / this.max;
      this.updateUser();
    });
  }

  updateUser() {
    this.userService.updateUser(this.user);
  }

  fermer() {
    this.router.navigate(['tabs']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
