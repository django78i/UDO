import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import { CompteurPageRoutingModule } from './compteur-routing.module';

import { CompteurPage } from './compteur.page';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import {Camera} from "@ionic-native/camera/ngx";
import {RouteReuseStrategy} from "@angular/router";
import {Health} from '@ionic-native/health/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompteurPageRoutingModule,
    RoundProgressModule
  ],
  declarations: [CompteurPage],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Health,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

  ],
})
export class CompteurPageModule {}
