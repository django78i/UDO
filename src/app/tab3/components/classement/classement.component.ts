import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { UserProfilComponent } from 'src/app/components/user-profil/user-profil.component';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.scss'],
})
export class ClassementComponent implements OnInit, OnChanges {
  @Input() championnat: any;
  @Input() user: any;

  classement: any[];

  constructor(
    public modalController: ModalController,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(this.championnat);
    this.classement = _.orderBy(
      this.championnat.participants,
      ['points'],
      ['desc']
    );
    console.log(this.classement);
    this.ref.detectChanges();
  }
  ngOnChanges() {
    this.classement = _.orderBy(
      this.championnat.participants,
      ['points'],
      ['desc']
    );
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
