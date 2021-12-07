import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import moment from 'moment';

@Component({
  selector: 'app-big-chall-slider',
  templateUrl: './big-chall-slider.component.html',
  styleUrls: ['./big-chall-slider.component.scss'],
})
export class BigChallSliderComponent implements OnInit, OnChanges {
  @Input() challenges: any[];
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
  };

  challengesFormat: any[] = [];
  @Output() challengeId: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    console.log(this.challenges);
    this.challenges.forEach((chall) => {
      const challenge = {
        ...chall,
        dateDemarrage: moment(chall.dateDemarrage).fromNow(),
      };
      this.challengesFormat.push(challenge);
      return challenge;
    });
    console.log(this.challengesFormat);
  }
  ngOnChanges() {}

  showChallenge(uid) {
    console.log(uid);
    this.challengeId.emit(uid);
  }
}
