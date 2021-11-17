import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import { PreseancePageRoutingModule } from './preseance-routing.module';

import { PreseancePage } from './preseance.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import {RouteReuseStrategy} from '@angular/router';
import {ActivitiesPage} from '../activities/activities.page';
import {ListMetricsPage} from '../list-metrics/list-metrics.page';
import {Health} from '@ionic-native/health/ngx';
import { ReglagesPage } from '../reglages/reglages.page';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment.prod';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Camera } from '@ionic-native/camera/ngx';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PreseancePageRoutingModule,
        NgCircleProgressModule.forRoot(),
        RoundProgressModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
    ],
  declarations: [PreseancePage,ActivitiesPage,ListMetricsPage,ReglagesPage],
  entryComponents: [ReglagesPage],
  providers: [Camera,Keyboard,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Health],

})
export class PreseancePageModule {}
