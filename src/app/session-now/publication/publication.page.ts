import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.scss'],
})
export class PublicationPage implements OnInit {
 /* listActivite = [{ name: 'Corps haut', value: '20', image: 'assets/images/corps-haut.svg' },
  { name: 'Corps bas', value: '100', image: 'assets/images/corps-bas.svg' },
  { name: 'Cardio', value: '20', image: 'assets/images/cardio.svg' },
  { name: 'Explosivité', value: '20', image: 'assets/images/explosivite.svg' },
  { name: 'Souplesse', value: '20', image: 'assets/images/souplesse.svg' },
  { name: 'Gainage', value: '20', image: 'assets/images/gainage.svg' }];*/
  listActivite=[];
  mode = '';
  modeClasse = '';
  demarrage = '';
  modeRow='';
  valeur=0;
  constructor(private router: Router, private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      // this.presentAlertConfirm();
    });
    setInterval(() => {
      if (localStorage.getItem('mode')) {
        if (localStorage.getItem('mode') === 'landscape') {
          this.mode = 'landscape';
          this.modeClasse = 'val-progess-lands';
          this.demarrage='c-ion-fab-lands';
          this.modeRow='c-row-lands';
        } else {
          this.mode = 'portrait';
          this.modeClasse = 'val-progess';
          this.demarrage='c-ion-fab';
          this.modeRow='c-row';
        }
      } else {
        this.modeClasse = 'val-progess';
        this.demarrage='c-ion-fab';
        this.modeRow='c-row';
      }
    }, 100);
    const activite = JSON.parse(localStorage.getItem('activite'));
    if (activite) {
      this.listActivite = activite.details;
      let counter:any = JSON.parse(localStorage.getItem('counter'));
      let time=0;

      if(counter){
        let minute =counter.mn;
        let seconde = counter.s;

        let valMinute;
        if(minute){
          valMinute = minute*60;
          valMinute +=seconde;
          time = valMinute/60;
          if(time>15){
            for(let act of this.listActivite){
              let val =parseInt(act.value)*time;
              act.value = val.toString();
              this.valeur+=parseInt(act.value);
            }
          }else{
            for(let act of this.listActivite){
              this.valeur+=parseInt(act.value);
            }
          }
        }else{
          for(let act of this.listActivite){
            this.valeur+=parseInt(act.value);
          }
        }

      }


    }
  }

  ngOnInit() {
  }
  fermer() {
    this.router.navigate(['tabs']);
  }

}
