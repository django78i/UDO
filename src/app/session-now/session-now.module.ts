import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';

import { SessionNowPageRoutingModule } from './session-now-routing.module';
import { SwiperModule } from 'swiper/angular';
import { NgCircleProgressModule } from 'ng-circle-progress';


import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

import {ActivitiesPage} from './activities/activities.page';
import {ReglagesPage} from './reglages/reglages.page';
import {SessionNowComponent} from './session-now.component';
import {ListMetricsPage} from './list-metrics/list-metrics.page';
import { Camera } from '@ionic-native/camera/ngx';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import {PreseancePage} from './preseance/preseance.page';
import {Health} from '@ionic-native/health/ngx';
import { IonicGestureConfig } from '../services/ionic-gesture-config.service';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatStepperModule,
    IonicModule,
    SessionNowPageRoutingModule,
    SwiperModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    RoundProgressModule,
    IonicModule.forRoot(),
    NgCircleProgressModule.forRoot(),
  ],
  declarations: [SessionNowComponent,ActivitiesPage,ReglagesPage,ListMetricsPage],
  // entryComponents: [ActivitiesPage,ReglagesPage,ListMetricsPage],
  providers: [Camera,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Health
  ,{provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}
  ],

})
export class SessionNowPageModule {}
