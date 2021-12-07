import {
  AfterContentChecked,
  EventEmitter,
  Component,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  OnChanges,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-slider-network',
  templateUrl: './slider-network.component.html',
  styleUrls: ['./slider-network.component.scss'],
})
export class SliderNetworkComponent implements OnInit, OnChanges {
  @Input() championnats: any[];

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  championnatList: any[] = [];

  @Output() champ: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    console.log(this.championnats);
  }

  ngOnChanges(){}


  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  ngAfterContentChecked(): void {
    // if (this.swiper) {
    //   this.swiper.map((swip) => swip.updateSwiper({}));
    // }
  }

  choice(champ) {
    this.champ.emit(champ);
  }
}
