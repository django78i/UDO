import { Component, OnInit } from '@angular/core';
import { MusicFeedService } from '../services/music-feed.service';
import { ModalController, AnimationController } from '@ionic/angular';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(
    public modalController: ModalController,
    public animationCtrl: AnimationController,
    public msService: MusicFeedService
  ) {}

  ngOnInit() {}

  changeTab(event) {
    event.tab != 'tab1'
      ? this.msService.currentPlay$.next(false)
      : this.msService.currentPlay$.next(true);
  }


  launch(){
    window.location.href = 'http://localhost:8100';
  }
}
