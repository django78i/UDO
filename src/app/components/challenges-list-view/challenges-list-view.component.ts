import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ChallengesService } from 'src/app/services/challenges.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-challenges-list-view',
  templateUrl: './challenges-list-view.component.html',
  styleUrls: ['./challenges-list-view.component.scss'],
})
export class ChallengesListViewComponent implements OnInit, OnChanges {
  @Input() challenges: any[];
  @Input() filter: string;
  @Input() competition: any;

  @Input() challengesFilered: any[];
  @Output() challengeChoice: EventEmitter<string> = new EventEmitter();

  config: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 20,
    direction: 'vertical',
  };

  constructor(public router: Router) {}

  ngOnInit() {}

  ngOnChanges() {
  }

  async showChallenge(ev) {
    console.log(ev);
    this.challengeChoice.emit(ev);
  }
}
