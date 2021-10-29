import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { SwiperModule } from 'swiper/angular';
import { TimeRelativePipe } from '../pipe/time-relative.pipe';
import { SliderChallengeComponent } from '../components/slider-challenge/slider-challenge.component';
import {ExternalSessionNowComponent} from "../session-now/external-session-now/external-session-now.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    MatProgressSpinnerModule,
    SwiperModule
  ],
  declarations: [
    Tab1Page,
    TimeRelativePipe,
    SliderChallengeComponent,
    ExternalSessionNowComponent
  ]
})
export class Tab1PageModule { }
