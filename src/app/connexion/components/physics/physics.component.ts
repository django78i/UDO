import {
  Component,
  OnInit,
  AfterContentChecked,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-physics',
  templateUrl: './physics.component.html',
  styleUrls: ['./physics.component.scss'],
})
export class PhysicsComponent implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('swiper2') swiper2: SwiperComponent;
  @Output() poids: EventEmitter<any> = new EventEmitter();
  @Output() taille: EventEmitter<any> = new EventEmitter();

  config: SwiperOptions = {
    slidesPerView: 10,
    direction: 'vertical',
    centeredSlides: true,
    spaceBetween: 10,
  };
  valuesTailles: number[] = [];
  valuesPoids: number[] = [];

  constructor() {}

  ngOnInit() {
    for (var i = 0; i < 201; i++) {
      this.valuesTailles.push(i);
    }
    for (var i = 0; i < 201; i++) {
      this.valuesPoids.push(i);
    }
  }

  changeTaille(event) {
    this.taille.emit({ taille: event.activeIndex });
  }

  changePoids(event) {
    this.poids.emit({ poids: event.activeIndex });
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
    if (this.swiper2) {
      this.swiper2.updateSwiper({});
    }
  }
}
