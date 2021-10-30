import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultatPageRoutingModule } from './resultat-routing.module';

import { ResultatPage } from './resultat.page';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultatPageRoutingModule,
  ],
  declarations: [ResultatPage],
  providers: [Camera],
})
export class ResultatPageModule {}
