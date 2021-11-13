import {
  AfterContentChecked,
  ChangeDetectorRef,
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
import * as _ from 'lodash';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-user-championnats-slide',
  templateUrl: './user-championnats-slide.component.html',
  styleUrls: ['./user-championnats-slide.component.scss'],
})
export class UserChampionnatsSlideComponent implements OnInit {
  @Input() championnats: any[];
  @Input() championnats$: Observable<any>;
  @Input() user: any;
  position: any;
  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  @Output() champ: EventEmitter<any> = new EventEmitter();
  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };

  userInfo: any;
  constructor(
    public zone: NgZone,
    public ref: ChangeDetectorRef,
    public userService: UserService
  ) {}

  ngOnInit() {
    console.log(this.championnats);
    this.userService.getCurrentUser().then((user) => {
      this.user = user;
      if (this.championnats.length) {
        this.championnats.map((champ, i) => {
          console.log(champ);
          this.userInfo = champ.participants.find(
            (user) => user.uid == this.user.uid
          );
          console.log(this.user);
          const classement = _.orderBy(champ.participants, ['points'], ['asc']);
          this.position = classement.findIndex(
            (user) => (user.uid = this.user.uid)
          );
          this.championnats[i].position = this.position;
          console.log(this.position);
          // this.ref.detectChanges()
        });
      }
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
