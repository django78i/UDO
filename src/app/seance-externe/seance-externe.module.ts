import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeanceExternePageRoutingModule } from './seance-externe-routing.module';

import { SeanceExternePage } from './seance-externe.page';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeanceExternePageRoutingModule,
    RoundProgressModule
  ],
  declarations: [SeanceExternePage]
})
export class SeanceExternePageModule {}
