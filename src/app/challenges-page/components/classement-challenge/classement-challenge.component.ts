import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { UserProfilComponent } from 'src/app/components/user-profil/user-profil.component';

@Component({
  selector: 'app-classement-challenge',
  templateUrl: './classement-challenge.component.html',
  styleUrls: ['./classement-challenge.component.scss'],
})
export class ClassementChallengeComponent implements OnInit, OnChanges {
  @Input() challenge: any;
  @Input() user: any;

  classement: any[];

  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.challenge);
    this.classement = _.orderBy(
      this.challenge.participants,
      ['value'],
      ['desc']
    );
  }

  ngOnChanges() {
    console.log(this.challenge);
    this.classement = _.orderBy(
      this.challenge.participants,
      ['value'],
      ['desc']
    );
  }

  async openProfil(contact) {
    const modal = await this.modalCtrl.create({
      component: UserProfilComponent,
      componentProps: {
        userId: contact,
        currentUser: this.user,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data == 'encore') {
        this.modalCtrl.dismiss();
      }
    });
    return await modal.present();
  }
}
