import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';

@Component({
  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        // animate('1s', style({ opacity: 0 }))
        animate(
          '1s',
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.2, offset: 0.2 }),
            style({ opacity: 0.5, offset: 0.3 }),
            style({ opacity: 1, offset: 1 }),
          ])
        ),
      ]),
      // transition('void => *', [animate(1000)]),
    ]),
  ],

  selector: 'app-resume-challenge',
  templateUrl: './resume-challenge.component.html',
  styleUrls: ['./resume-challenge.component.scss'],
})
export class ResumeChallengeComponent implements OnInit, OnChanges {
  @Input() challenge: any;
  userEncours: any;
  @Input() user: any;

  constructor(public ref: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.challenge);
    this.userEncours = this.challenge.participants.find(
      (part) => part.uid == this.user.uid
    );
    // this.ref.detectChanges();
    console.log(this.userEncours);
  }
}
