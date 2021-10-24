import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import { DemarragePageRoutingModule } from './demarrage-routing.module';

import { DemarragePage } from './demarrage.page';
import {Camera} from '@ionic-native/camera/ngx';
import {RouteReuseStrategy} from '@angular/router';
import {Health} from '@ionic-native/health/ngx';
import { IonicGestureConfig } from '../../services/ionic-gesture-config.service';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {LongPressModule} from 'ionic-long-press';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemarragePageRoutingModule,
    LongPressModule
  ],
  declarations: [DemarragePage],
  providers: [Camera,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Health
 ,{provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig} ],

})
export class DemarragePageModule {}
