import {
  AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-slider-championnat',
  templateUrl: './slider-championnat.component.html',
  styleUrls: ['./slider-championnat.component.scss'],
})
export class SliderChampionnatComponent implements OnInit, AfterContentChecked {
  @Input() championnats: any[];

  championnatList: any[] = [];

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @Output() champ: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    console.log(this.championnats);
  }

  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.map((swip) => swip.updateSwiper({}));
    }
  }

  choice(champ) {
    console.log(champ);
    this.champ.emit(champ);
  }
}
