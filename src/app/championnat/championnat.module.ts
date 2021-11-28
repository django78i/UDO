import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChampionnatPageRoutingModule } from './championnat-routing.module';

import { ChampionnatPage } from './championnat.page';
import { ResumeComponent } from '../tab3/components/resume/resume.component';
import { FeedsComponent } from '../tab3/components/feeds/feeds.component';
import { ClassementComponent } from '../tab3/components/classement/classement.component';
import { TimeChampPipe } from 'src/app/pipe/time-champ.pipe';
import { TimeRelativePipe } from '../pipe/time-relative.pipe';
import { FriendsListComponent } from '../tab3/components/friends-list/friends-list.component';
import { FriendPageListComponent } from '../components/friend-page-list/friend-page-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChampionnatPageRoutingModule,
  ],
  declarations: [
    ChampionnatPage,
    ClassementComponent,
    FeedsComponent,
    ResumeComponent,
    TimeChampPipe,
    FriendsListComponent,
    TimeRelativePipe,
    FriendPageListComponent,
  ],
})
export class ChampionnatPageModule {}
