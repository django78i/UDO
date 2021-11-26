import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChallengesPagePageRoutingModule } from './challenges-page-routing.module';

import { ChallengesPagePage } from './challenges-page.page';
import { ResumeChallengeComponent } from './components/resume-challenge/resume-challenge.component';
import { ClassementChallengeComponent } from './components/classement-challenge/classement-challenge.component';
import { TimeChampPipe } from '../pipe/time-champ.pipe';
import { TimeRelativePipe } from '../pipe/time-relative.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChallengesPagePageRoutingModule,
  ],
  declarations: [
    ChallengesPagePage,
    ResumeChallengeComponent,
    ClassementChallengeComponent,
    TimeChampPipe,
    TimeRelativePipe
  ],
})
export class ChallengesPagePageModule {}
