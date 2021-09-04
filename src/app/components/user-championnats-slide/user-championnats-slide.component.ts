import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-user-championnats-slide',
  templateUrl: './user-championnats-slide.component.html',
  styleUrls: ['./user-championnats-slide.component.scss'],
})
export class UserChampionnatsSlideComponent implements OnInit {

  @Input() championnats: any[];

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @Output() champ: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };


  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.map(swip => swip.updateSwiper({}));
    }
  }

  choice(champ) {
    console.log(champ)
    this.champ.emit(champ);
  }



}
