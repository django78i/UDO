import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { UserProfilComponent } from 'src/app/components/user-profil/user-profil.component';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.scss'],
})
export class ClassementComponent implements OnInit {
  @Input() challenge: any;
  @Input() user: any;

  classement: any[];

  constructor(public modalController: ModalController) {}

  ngOnInit() {
    console.log(this.challenge);
    this.classement = _.orderBy(this.challenge.participants, ['points'], ['desc']);
  }

  async openProfil(contact) {
    console.log(contact);
    const modal = await this.modalController.create({
      component: UserProfilComponent,
      componentProps: {
        user: contact,
        currentUser: this.user,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data == 'encore') {
        this.modalController.dismiss();
      }
    });
    return await modal.present();
  }
}
