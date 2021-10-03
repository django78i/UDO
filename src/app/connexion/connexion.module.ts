import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnexionPageRoutingModule } from './connexion-routing.module';
import { SwiperModule } from 'swiper/angular';

import { ConnexionPage } from './connexion.page';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import {MatIconModule} from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatStepperModule,
    IonicModule,
    ConnexionPageRoutingModule,
    SwiperModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ],
  declarations: [ConnexionPage, LoginModalComponent],
})
export class ConnexionPageModule {}
