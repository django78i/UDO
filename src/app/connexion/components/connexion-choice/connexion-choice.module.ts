import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IonicModule } from '@ionic/angular';
import { ConnexionChoiceComponent } from './connexion-choice.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnexionChoicePageRoutingModule } from './connexion-routing.module';

@NgModule({
  declarations: [ConnexionChoiceComponent],
  // exports: [AccordeonComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    IonicModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    ConnexionChoicePageRoutingModule,
  ],
})
export class ConnexionModule {}
