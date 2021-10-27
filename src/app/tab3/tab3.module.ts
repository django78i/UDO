import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { SwiperModule } from 'swiper/angular';
import { ModalChampComponent } from './components/modal-champ/modal-champ.component';
import { SliderChallengeComponent } from '../components/slider-challenge/slider-challenge.component';
import { TimeRelativePipe } from '../pipe/time-relative.pipe';
import { SliderChampionnatComponent } from '../components/slider-championnat/slider-championnat.component';
import { UserChampionnatsSlideComponent } from '../components/user-championnats-slide/user-championnats-slide.component';
import { SliderNetworkComponent } from '../components/slider-network/slider-network.component';
import { ClassementComponent } from './components/classement/classement.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { ResumeComponent } from './components/resume/resume.component';
import { CreateChampPopUpComponent } from './components/create-champ-pop-up/create-champ-pop-up.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PopOverComponentComponent } from './components/pop-over-component/pop-over-component.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { AccordeonComponent } from '../components/accordeon/accordeon.component';
import { EmojisComponent } from '../components/emojis/emojis.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
    SwiperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  declarations: [
    Tab3Page,
    ModalChampComponent,
    SliderChallengeComponent,
    TimeRelativePipe,
    SliderChampionnatComponent,
    UserChampionnatsSlideComponent,
    SliderNetworkComponent,
    ClassementComponent,
    FeedsComponent,
    ResumeComponent,
    CreateChampPopUpComponent,
    PopOverComponentComponent,
    ActivityListComponent,
    FriendsListComponent,
    AccordeonComponent,
    EmojisComponent,
  ],
})
export class Tab3PageModule {}
