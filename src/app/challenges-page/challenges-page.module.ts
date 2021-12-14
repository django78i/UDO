import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChallengesPagePageRoutingModule } from './challenges-page-routing.module';

import { ChallengesPagePage } from './challenges-page.page';
import { ResumeChallengeComponent } from './components/resume-challenge/resume-challenge.component';
import { ClassementChallengeComponent } from './components/classement-challenge/classement-challenge.component';
import { TimeChampPipe } from '../pipe/time-champ.pipe';
import { TimeRelativePipe } from '../pipe/time-relative.pipe';
import { ChallTemplateComponent } from '../components/chall-template/chall-template.component';
import { FeedsComponent } from '../tab3/components/feeds/feeds.component';

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
    TimeRelativePipe,
    ChallTemplateComponent,
    ResumeChallengeComponent,
    ClassementChallengeComponent,
    FeedsComponent,
  ],
})
export class ChallengesPagePageModule {}
