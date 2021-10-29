import {
  AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-user-championnats-slide',
  templateUrl: './user-championnats-slide.component.html',
  styleUrls: ['./user-championnats-slide.component.scss'],
})
export class UserChampionnatsSlideComponent implements OnInit {
  @Input() championnats: any[];
  @Input() championnats$: Observable<any>;
  @Input() user: any[];

  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @Output() champ: EventEmitter<any> = new EventEmitter();
  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  userInfo: any[] = [];
  constructor(public zone: NgZone) {}

  ngOnInit() {
    this.championnats.map((champ) => {
      this.userInfo.push(
        champ.participants.find((user) => user.uid == champ.createur.uid)
      );
    });
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.map((swip) => swip.updateSwiper({}));
    }
  }

  choice(champ) {
    this.champ.emit(champ);
  }
}
