import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicationPageRoutingModule } from './publication-routing.module';

import { PublicationPage } from './publication.page';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicationPageRoutingModule,
    RoundProgressModule
  ],
  declarations: [PublicationPage]
})
export class PublicationPageModule {}
