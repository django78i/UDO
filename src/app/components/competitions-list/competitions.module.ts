import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CompetitionsListComponent } from './competitions-list.component';
import { CompetitionsListPageRoutingModule } from './championnat-routing.module';
import { ChallengesListViewComponent } from '../challenges-list-view/challenges-list-view.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CompetitionsListPageRoutingModule],
  declarations: [CompetitionsListComponent, ChallengesListViewComponent],
})
export class CompetitionsPageModule {}
