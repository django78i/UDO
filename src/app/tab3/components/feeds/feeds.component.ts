import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { from, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmojisComponent } from 'src/app/components/emojis/emojis.component';
import { MusicFeedService } from 'src/app/services/music-feed.service';
import { DetailPostComponent } from '../detail-post/detail-post.component';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss'],
})
export class FeedsComponent implements OnInit, OnDestroy {
  feed$: Observable<any>;
  feed: any[] = [];
  lastVisible: any;
  @Input() user: any;
  @Input() championnat: any;
  subscription: Subscription;
  subscription2: Subscription;
  constructor(
    public musService: MusicFeedService,
    public http: HttpClient,
    public navCtl: NavController,
    public popoverController: PopoverController,
    public mService: MusicFeedService,
    public modalController: ModalController
  ) {}

  async ngOnInit() {
    this.feed$ = from(this.mService.feedQuery());
    this.subscription = this.feed$.subscribe((f) => {
      this.lastVisible = f.last;
      f.table.forEach((fee) => this.feed.push(fee));
    });
  }

  doRefresh(event) {
    setTimeout(() => {
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
  }

  async loadData(event) {
    const taille = await this.mService.getFeed();
    const feedPlus = from(this.mService.addQuery(this.lastVisible));
    setTimeout(() => {
      event.target.complete();
      this.subscription2 = feedPlus.subscribe((f: any) => {
        f.forEach((fed) => this.feed.push(fed));
      });
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (taille.length <= this.feed.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async openDetail(post) {
    const modal = await this.modalController.create({
      component: DetailPostComponent,
      cssClass: 'testModal',
      componentProps: {
        post,
        user: this.user,
      },
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }
}
