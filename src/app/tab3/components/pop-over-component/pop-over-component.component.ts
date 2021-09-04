import { AfterContentChecked, Component, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-pop-over-component',
  templateUrl: './pop-over-component.component.html',
  styleUrls: ['./pop-over-component.component.scss'],
})
export class PopOverComponentComponent implements OnInit, AfterContentChecked {

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @Output() slide: EventEmitter<any> = new EventEmitter();
  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 20,
  };

  bannieres = [
    'assets/banner/blackBanner.svg',
    'assets/banner/redBanner.svg',
    'assets/banner/greenBanner.svg'
  ]
  constructor() { }

  ngOnInit() { }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.map(swip => swip.updateSwiper({}));
    }
  }

  chooseSlide(ban) {
    this.slide.emit(ban);
  }

}
