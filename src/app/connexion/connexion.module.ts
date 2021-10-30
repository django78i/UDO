import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnexionPageRoutingModule } from './connexion-routing.module';
import { SwiperModule } from 'swiper/angular';

import { ConnexionPage } from './connexion.page';
import { LoginModule } from './components/login-modal/login/login.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ConnexionPageRoutingModule,
    SwiperModule,
    LoginModule,
  ],
  declarations: [ConnexionPage],
})
export class ConnexionPageModule {}
