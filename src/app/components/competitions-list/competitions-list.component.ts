import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-competitions-list',
  templateUrl: './competitions-list.component.html',
  styleUrls: ['./competitions-list.component.scss'],
})
export class CompetitionsListComponent implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper : SwiperComponent
  segmentValue: string = 'championnats';
  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 20,
    direction: 'vertical',
  };

  championnatNetwork: any[] = [];

  constructor(
    public modalCtrl: ModalController,
    public champService: ChampionnatsService
  ) {}

  ngOnInit() {
    this.champService.getChampionnats();
    this.champService.champNetWork$
      .pipe(
        tap((r) => {
          console.log(r);
          r == null
            ? (this.championnatNetwork = [])
            : this.championnatNetwork.push(r);
        })
      )
      .subscribe();
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  viewChange(ev) {
    this.segmentValue = ev.detail.value;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
