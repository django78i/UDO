import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-slider-championnat',
  templateUrl: './slider-championnat.component.html',
  styleUrls: ['./slider-championnat.component.scss'],
})
export class SliderChampionnatComponent
  implements OnInit, AfterContentChecked, OnChanges
{
  @Input() championnats: any[];

  championnatList: any[] = [];
  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @Output() champ: EventEmitter<any> = new EventEmitter();

  constructor(public ref: ChangeDetectorRef, public zone: NgZone) {}

  ngOnInit() {}

  ngOnChanges() {}

  ngAfterContentChecked(): void {
    // if (this.swiper) {
    //   // this.zone.run(()=>{
    //     this.swiper.map((swip) => swip.updateSwiper({}));
    //   // })
    // }
  }

  choice(champ) {
    this.champ.emit(champ);
  }
}
