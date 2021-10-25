import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MusicFeedService } from 'src/app/services/music-feed.service';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss'],
})
export class FeedsComponent implements OnInit {
  feed$: Observable<any>;
  feed: any[] =[];
  @Input() user: any;
  constructor(
    public musService: MusicFeedService,
    public http: HttpClient,
    public navCtl: NavController
  ) {}

  ngOnInit() {
    this.feed$ = this.http
      .get('../../assets/mocks/feed.json')
      .pipe(tap((r) => console.log(r)));
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
