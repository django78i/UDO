import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from './login-modal.component';
import { AccordeonComponent } from 'src/app/components/accordeon/accordeon.component';
import { PhysicsComponent } from '../../physics/physics.component';
import { GenderComponent } from '../../gender/gender.component';
import { ConnexionChoiceComponent } from '../../connexion-choice/connexion-choice.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [
    LoginModalComponent,
    AccordeonComponent,
    PhysicsComponent,
    GenderComponent,
    ConnexionChoiceComponent,
  ],
  exports: [
    LoginModalComponent,
    AccordeonComponent,
    PhysicsComponent,
    GenderComponent,
    ConnexionChoiceComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatStepperModule,
    IonicModule,
    SwiperModule
  ],
})
export class LoginModule {}
