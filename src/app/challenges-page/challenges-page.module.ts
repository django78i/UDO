import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChallengesPagePageRoutingModule } from './challenges-page-routing.module';

import { ChallengesPagePage } from './challenges-page.page';
import { ResumeChallengeComponent } from './components/resume-challenge/resume-challenge.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChallengesPagePageRoutingModule,
  ],
  declarations: [ChallengesPagePage, ResumeChallengeComponent],
})
export class ChallengesPagePageModule {}
