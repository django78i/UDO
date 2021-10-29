import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeanceExterneFinalPageRoutingModule } from './seance-externe-final-routing.module';

import { SeanceExterneFinalPage } from './seance-externe-final.page';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeanceExterneFinalPageRoutingModule,
    RoundProgressModule
  ],
  declarations: [SeanceExterneFinalPage]
})
export class SeanceExterneFinalPageModule {}
