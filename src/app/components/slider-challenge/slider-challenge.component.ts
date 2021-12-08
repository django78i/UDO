import {
  AfterContentChecked,
  EventEmitter,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
  Output,
  OnChanges,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-slider-challenge',
  templateUrl: './slider-challenge.component.html',
  styleUrls: ['./slider-challenge.component.scss'],
})
export class SliderChallengeComponent
  implements OnInit, AfterContentChecked, OnChanges
{
  @Input() challenges: any[];

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @Output() slide: EventEmitter<any> = new EventEmitter();
  @Output() challengeId: EventEmitter<any> = new EventEmitter();
  countDownChallenge: number;
  pourcentage: number;

  constructor() {}

  ngOnInit() {
    // this.countDownChallenge = (this.challenges.completion.value /chall.objectifs)*100
  }

  ngOnChanges() {
    // this.challenges.forEach((chall) => {
    //   const pourcentage = Number(chall.completion.value / chall.objectifs);
    //   return { ...chall, pourcentage: pourcentage };
    // });
    // console.log(this.challenges)
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

  showChallenge(uid) {
    console.log(uid);
    this.challengeId.emit(uid);
  }
}
