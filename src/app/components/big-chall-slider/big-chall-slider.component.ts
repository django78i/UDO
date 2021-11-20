import { Component, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-big-chall-slider',
  templateUrl: './big-chall-slider.component.html',
  styleUrls: ['./big-chall-slider.component.scss'],
})
export class BigChallSliderComponent implements OnInit {
  @Input() challenges: any[];
  // config: SwiperOptions = {
  //   // slidesPerView: 1.3,
  //   // spaceBetween: 20,
  //   direction: 'vertical',
  // };

  constructor() {}

  ngOnInit() {
    console.log(this.challenges);
  }
}
