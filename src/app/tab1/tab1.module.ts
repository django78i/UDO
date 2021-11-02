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
import { TimeFeedPipe } from '../pipe/time-feed.pipe';

@NgModule({
  imports: [

    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    MatProgressSpinnerModule,
    SwiperModule,
  ],
  declarations: [
    Tab1Page,
    TimeRelativePipe
  ]
})
export class Tab1PageModule { }
