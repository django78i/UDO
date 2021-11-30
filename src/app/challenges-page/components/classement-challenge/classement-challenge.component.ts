import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-classement-challenge',
  templateUrl: './classement-challenge.component.html',
  styleUrls: ['./classement-challenge.component.scss'],
})
export class ClassementChallengeComponent implements OnInit ,OnChanges {
  @Input() challenge: any;
  @Input() user: any;

  classement: any[];

  constructor() {}

  ngOnInit() {
    console.log(this.challenge);
    this.classement = _.orderBy(this.challenge.participants, ['points'], ['desc']);
  }
  
  ngOnChanges() {
    console.log(this.challenge);
    this.classement = _.orderBy(this.challenge.participants, ['points'], ['desc']);

  }
  
}
