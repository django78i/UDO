import {
  AfterContentChecked,
  AfterViewInit,
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
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import * as _ from 'lodash';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-user-championnats-slide',
  templateUrl: './user-championnats-slide.component.html',
  styleUrls: ['./user-championnats-slide.component.scss'],
})
export class UserChampionnatsSlideComponent implements OnChanges {
  @Input() championnats: any[];
  @Output() champ: EventEmitter<any> = new EventEmitter();

  //slider
  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  //informations sur le user dans le championnat
  userInfo: any;
  //position
  postion: number;
  constructor(
    public zone: NgZone,
    public ref: ChangeDetectorRef,
    public userService: UserService
  ) {}

  ngOnChanges() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (this.championnats.length) {
      this.championnats.forEach((champ, i) => {
        this.userInfo = champ.participants.find(
          (userChamp) => user.uid == userChamp.uid
        );
        this.postion =
          champ.participants.findIndex((champ) => champ.uid == user.uid) + 1;

        champ.userInfo = { ...this.userInfo, position: this.postion };
      });
      console.log(this.championnats);
    }
  }

  choice(champ) {
    this.champ.emit(champ);
  }
}
