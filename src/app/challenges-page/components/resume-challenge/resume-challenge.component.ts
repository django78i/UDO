import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resume-challenge',
  templateUrl: './resume-challenge.component.html',
  styleUrls: ['./resume-challenge.component.scss'],
})
export class ResumeChallengeComponent implements OnInit {
  @Input() challenge: any;
  @Input() userEncours: any;

  constructor() {}

  ngOnInit() {}
}
