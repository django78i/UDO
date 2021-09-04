import { Component, OnInit } from '@angular/core';
import { MusicFeedService } from '../services/music-feed.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  constructor(
    public msService: MusicFeedService
  ) { }

  ngOnInit() {
  }

  changeTab(event) {
    event.tab != 'tab1' ? this.msService.currentPlay$.next(false) : this.msService.currentPlay$.next(true);
  }

}
