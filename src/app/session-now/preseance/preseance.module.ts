import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import { PreseancePageRoutingModule } from './preseance-routing.module';

import { PreseancePage } from './preseance.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import {Camera} from '@ionic-native/camera/ngx';
import {RouteReuseStrategy} from '@angular/router';
import {ActivitiesPage} from '../activities/activities.page';
import {ListMetricsPage} from '../list-metrics/list-metrics.page';
import {Health} from '@ionic-native/health/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreseancePageRoutingModule,
    NgCircleProgressModule.forRoot(),
    RoundProgressModule
  ],
  declarations: [PreseancePage,ActivitiesPage,ListMetricsPage],
  providers: [Camera,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Health],

})
export class PreseancePageModule {}
