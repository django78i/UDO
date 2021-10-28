import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from './login-modal.component';
import { AccordeonComponent } from 'src/app/components/accordeon/accordeon.component';
import { PhysicsComponent } from '../../physics/physics.component';
import { GenderComponent } from '../../gender/gender.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { OnBoardingRoutingModule } from './connexion-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginModalComponent,
    AccordeonComponent,
    PhysicsComponent,
    GenderComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    IonicModule,
    SwiperModule,
    OnBoardingRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
  ],
})
export class LoginModule {}
