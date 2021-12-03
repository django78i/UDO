import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { MusicFeedService } from 'src/app/services/music-feed.service';
import { SessionNowService } from 'src/app/services/session-now-service.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit {
  constructor(
    public popoverController: PopoverController,
    public navParam: NavParams,
    public feedService: MusicFeedService,
    public sessionNowService: SessionNowService
  ) {}

  ngOnInit() {}

  async supprimer() {
    const post = await this.feedService.deletePost(this.navParam.data.uid);
    this.feedService
      .deletePost(this.navParam.data.uid)
      .then(() => {
        this.sessionNowService.show('post supprimé', 'success');
      })
      .catch((err) =>
        this.sessionNowService.show(
          "une erreur s'est produite, veuillez rééssayer plus tard",
          'warning'
        )
      );
    this.popoverController.dismiss(true);
  }
}
