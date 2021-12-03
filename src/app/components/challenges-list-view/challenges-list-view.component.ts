import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ChallengesService } from 'src/app/services/challenges.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-challenges-list-view',
  templateUrl: './challenges-list-view.component.html',
  styleUrls: ['./challenges-list-view.component.scss'],
})
export class ChallengesListViewComponent implements OnInit, OnChanges {
  challenges: any[] = [];
  @Input() filter: string;
  @Input() competition: any;

  challengesFilered: any[] = [];
  @Output() challengeChoice: EventEmitter<string> = new EventEmitter();

  config: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 20,
    direction: 'vertical',
  };

  constructor(public challService: ChallengesService, public router: Router) {}

  ngOnInit() {
    this.challService.getChallengesList();
    this.challService.challengesList$
      .pipe(
        tap((r) => {
          if (r) {
            console.log(r);
            this.challenges.push(r);
          }
          // this.ref.detectChanges();
        })
      )
      .subscribe();
  }

  ngOnChanges() {
    const filter = this.challenges.filter((champ) =>
      champ.name.toLowerCase().includes(this.filter.toLowerCase().trim())
    );
    console.log(filter);
    this.challengesFilered = filter;
  }


  
  async showChallenge(ev) {
    console.log(ev);
    this.challengeChoice.emit(ev);
    
  }
}
