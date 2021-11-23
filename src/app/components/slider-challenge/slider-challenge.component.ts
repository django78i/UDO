import {
  AfterContentChecked,
  EventEmitter,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
  Output,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-slider-challenge',
  templateUrl: './slider-challenge.component.html',
  styleUrls: ['./slider-challenge.component.scss'],
})
export class SliderChallengeComponent implements OnInit, AfterContentChecked {
  @Input() challenges: any[];

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @Output() slide: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    console.log(this.challenges[0].dateDemarrage);
  }

  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  ngAfterContentChecked(): void {
    // if (this.swiper) {
    //   this.swiper.map(swip => swip.updateSwiper({}));
    // }
  }

  change(ev) {
    const chall = this.challenges[ev.activeIndex];
    this.slide.emit(chall);
  }
}
