import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { ModalChampComponent } from 'src/app/tab3/components/modal-champ/modal-champ.component';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-competitions-list',
  templateUrl: './competitions-list.component.html',
  styleUrls: ['./competitions-list.component.scss'],
})
export class CompetitionsListComponent implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;
  segmentValue: string = 'championnats';
  config: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 10,
    direction: 'vertical',
  };

  @Input() segmentSelected: string;

  championnatNetwork: any[] = [];
  championnatsFiltered: any[] = [];
  filter: string;
  subscription: Subscription;
  constructor(
    public modalCtrl: ModalController,
    public champService: ChampionnatsService,
    public ref: ChangeDetectorRef,
    public router: Router,
    public navCtl: NavController,
    public zone: NgZone // public navParams: NavParams
  ) {}

  ngOnInit() {
    // this.segmentValue = this.navParams.data.segmentSelected;
    console.log('state');
    this.champService.getChampionnatNetwork();
    this.subscription = this.champService.champNetWorkList$
      .pipe(
        tap((r) => {
          if (r) {
            console.log(r);
            this.championnatNetwork.push(r);
          }
          this.ref.detectChanges();
        })
      )
      .subscribe();
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  search(ev) {
    this.filter = ev.detail.value;
    const filter = this.championnatNetwork.filter((champ) =>
      champ.name.toLowerCase().includes(ev.detail.value.toLowerCase().trim())
    );
    this.championnatsFiltered = filter;
  }

  viewChange(ev) {
    this.segmentValue = ev.detail.value;
  }

  async navigateChallenge(ev) {
    const modal = await this.modalCtrl.create({
      component: ModalChampComponent,
      componentProps: { champId: ev, entryData: 'challenge' },
    });
    return await modal.present();
  }

  async navigateChampionnat(ev) {
    const modal = await this.modalCtrl.create({
      component: ModalChampComponent,
      componentProps: { champId: ev, entryData: 'championnat' },
    });
    return await modal.present();

    // console.log(ev);
    // this.close();
    // this.router.navigate([`/championnat/${ev}`]);
  }

  close() {
      this.navCtl.navigateBack('tabs/tab3');
  }
}
