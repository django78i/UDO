import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit, OnChanges {
  @Input() championnat: any;
  userInfo: any;
  constructor() {}

  ngOnInit() {
    this.userInfo = this.championnat.participants.find(
      (part) => part.uid == this.championnat.createur.uid
    );
  }

  ngOnChanges() {
    this.userInfo = this.championnat.participants.find(
      (part) => part.uid == this.championnat.createur.uid
    );
  }
}
