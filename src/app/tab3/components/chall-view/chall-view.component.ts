import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CompetitionsListComponent } from 'src/app/components/competitions-list/competitions-list.component';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-chall-view',
  templateUrl: './chall-view.component.html',
  styleUrls: ['./chall-view.component.scss'],
})
export class ChallViewComponent implements OnInit, OnChanges {
  bannData: any;
  @Input() challenges: any[];
  @Input() challEncours: any[];
  @Input() challengesUser: any[];
  @Input() user: any;
  @Input() challengesTermines: any[];
  @Input() loader: boolean

  @Output() createChall: EventEmitter<any> = new EventEmitter();
  @Output() challengeId: EventEmitter<any> = new EventEmitter();
  @Output() viewAllChall: EventEmitter<any> = new EventEmitter();

  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };
  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  temporaire = [1, 2, 3];

  loading: boolean = true;
  admin: boolean = false;
  constructor(
    public http: HttpClient,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.http
      .get<any[]>('../../../assets/mocks/admin.json')
      .pipe(
        tap(
          (ad) =>
            (this.admin = ad.some((userAdmin) => userAdmin == this.user.uid))
        )
      )
      .subscribe();
  }

  ionViewWillEnter() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (
      this.challenges.length ||
      this.challEncours.length ||
      this.challengesUser.length
    ) {
      this.loading = false;
    }
  }

  buttonClick() {
    this.createChall.emit();
  }

  chooseChallenge(ev) {
    console.log(ev);
    this.challengeId.emit(ev);
  }

  async openCompetitionList() {
    this.viewAllChall.emit([]);
  }
}
