import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
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
export class ChallViewComponent implements OnInit {
  bannData: any;
  @Input() challenges: any[];
  @Input() challEncours: any[];
  @Input() challengesUser: any[];

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

  constructor(
    public http: HttpClient,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
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
    // const modal = await this.modalController.create({
    //   component: CompetitionsListComponent,
    //   componentProps : {
    //     segmentSelected : 'challenges'
    //   }
    // });
    // return await modal.present();
  }
}
