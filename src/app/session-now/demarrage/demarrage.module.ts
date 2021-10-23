import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import { DemarragePageRoutingModule } from './demarrage-routing.module';

import { DemarragePage } from './demarrage.page';
import {Camera} from '@ionic-native/camera/ngx';
import {RouteReuseStrategy} from '@angular/router';
import {Health} from '@ionic-native/health/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemarragePageRoutingModule
  ],
  declarations: [DemarragePage],
  providers: [Camera,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Health],

})
export class DemarragePageModule {}