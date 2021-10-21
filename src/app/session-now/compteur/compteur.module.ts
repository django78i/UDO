import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompteurPageRoutingModule } from './compteur-routing.module';

import { CompteurPage } from './compteur.page';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompteurPageRoutingModule,
    RoundProgressModule
  ],
  declarations: [CompteurPage]
})
export class CompteurPageModule {}
