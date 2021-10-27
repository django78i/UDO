import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmojisComponent } from 'src/app/components/emojis/emojis.component';
import { MusicFeedService } from 'src/app/services/music-feed.service';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss'],
})
export class FeedsComponent implements OnInit {
  feed$: Observable<any>;
  feed: any[] = [];
  @Input() user: any;
  @Input() championnat: any;
  constructor(
    public musService: MusicFeedService,
    public http: HttpClient,
    public navCtl: NavController,
    public popoverController: PopoverController
  ) {}

  ngOnInit() {
    if (this.championnat.status == 'en cours') {
      this.feed$ = this.http
        .get('../../assets/mocks/feed.json')
        .pipe(tap((r) => console.log(r)));
    }
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: EmojisComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
