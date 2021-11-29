import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-resume-challenge',
  templateUrl: './resume-challenge.component.html',
  styleUrls: ['./resume-challenge.component.scss'],
})
export class ResumeChallengeComponent implements OnInit, OnChanges {
  @Input() challenge: any;
  userEncours: any;
  @Input() user: any;

  constructor() {}

  ngOnInit() {
    console.log(this.challenge, this.user);
    this.userEncours = this.challenge.participants.find(
      (part) => part.uid == this.user.uid
    );
    console.log(this.userEncours);
  }

  ngOnChanges() {
    this.userEncours = this.challenge.participants.find(
      (part) => part.uid == this.user.uid
    );
    console.log(this.userEncours);
  }
}
