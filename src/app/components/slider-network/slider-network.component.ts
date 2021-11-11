import { AfterContentChecked, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-slider-network',
  templateUrl: './slider-network.component.html',
  styleUrls: ['./slider-network.component.scss'],
})
export class SliderNetworkComponent implements OnInit {

  @Input() championnats: any[];

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  championnatList: any[] = [];

  constructor() { }

  ngOnInit() {
    console.log(this.championnats)

  }

  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };


  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.map(swip => swip.updateSwiper({}));
    }
  }

}
