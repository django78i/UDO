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
import { AidePage } from '../aide/aide.page';
import { ReglagesPage } from '../reglages/reglages.page';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment.prod';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import 'firebase/storage';
import { ShowNotificationComponent } from '../show-notification/show-notification.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemarragePageRoutingModule,
    LongPressModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  declarations: [DemarragePage,AidePage,ReglagesPage,ShowNotificationComponent],
  providers: [Camera,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Health
 ,{provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig} ],

})
export class DemarragePageModule {}
