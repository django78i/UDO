import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { takeLast } from 'rxjs/operators';
import { ChallengesService } from '../services/challenges.service';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-challenges-page',
  templateUrl: './challenges-page.page.html',
  styleUrls: ['./challenges-page.page.scss'],
})
export class ChallengesPagePage implements OnInit {
  segmentValue = 'resume';
  user: any;
  challenge: any;
  userEncours: any;

  constructor(
    private navCtl: NavController,
    public userService: UserService,
    public challService: ChallengesService,
    public route: ActivatedRoute,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().then((user) => {
      this.user = user;
      const uid = this.route.snapshot.params['id'];
      this.challService.getChallenge(uid);
      this.challService.singleChallSub$.pipe(takeLast(1)).subscribe((champ) => {
        this.challenge = champ;
        console.log(this.challenge);
        this.userEncours = this.challenge.participants.find(
          (part) => part.uid == this.user.uid
        );
        this.ref.detectChanges();
      });
    });
  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
  }

  close() {
    this.navCtl.navigateBack('/tabs/tab3');
  }
}
