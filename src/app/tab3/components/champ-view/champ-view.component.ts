import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChildren,
  QueryList,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CompetitionsListComponent } from 'src/app/components/competitions-list/competitions-list.component';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-champ-view',
  templateUrl: './champ-view.component.html',
  styleUrls: ['./champ-view.component.scss'],
})
export class ChampViewComponent
  implements OnInit, OnChanges, AfterContentChecked
{
  @Input() userChampionnats: any[];
  @Input() championnatsList: any[];
  @Input() champinonatNetwork: any[];
  @Input() championnatTermines: any[];
  @Input() loader: boolean;

  @Output() champChoice: EventEmitter<any> = new EventEmitter();
  @Output() createChamp: EventEmitter<any> = new EventEmitter();
  @Output() viewAllChamp: EventEmitter<any> = new EventEmitter();

  loading: boolean = true;

  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
  };
  @ViewChildren('swiper') swiper: QueryList<SwiperComponent>;
  temporaire = [1, 2, 3];

  constructor(
    public router: Router,
    public modalController: ModalController,
  ) {}

  ngOnInit() {
    console.log(this.loader);
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.forEach((swip) => swip.updateSwiper({}));
    }
  }

  async launchDetail(ev) {
    this.champChoice.emit(ev);
  }

  ngOnChanges(changes) {
    if (
      this.userChampionnats?.length ||
      this.championnatsList?.length ||
      this.champinonatNetwork?.length ||
      this.championnatTermines?.length
      // changes.userChampionnats?.currentValue.length ||
      // changes.championnatsList?.currentValue.length ||
      // changes.champinonatNetwork?.currentValue.length
    ) {
      this.loading = false;
    }
    console.log(this.loading);

    console.log(changes);
  }

  buttonClick() {
    this.createChamp.emit();
  }

  openCompetitionList() {
    this.viewAllChamp.emit('championnats');
  }
}
