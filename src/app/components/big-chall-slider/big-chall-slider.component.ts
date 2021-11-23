import { Component, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import moment from 'moment';

@Component({
  selector: 'app-big-chall-slider',
  templateUrl: './big-chall-slider.component.html',
  styleUrls: ['./big-chall-slider.component.scss'],
})
export class BigChallSliderComponent implements OnInit {

  @Input() challenges: any[];
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
  };

  challengesFormat :any[] = []

  constructor() {}

  ngOnInit() {
    console.log(this.challenges);
    this.challenges.forEach((chall) => {
      const challenge = {
        ...chall,
        dateDemarrage: moment(chall.dateDemarrage).fromNow(),
      };
      this.challengesFormat.push(challenge)
      return challenge;
    });
    console.log(this.challengesFormat);
  }
}
