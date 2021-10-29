import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.scss'],
})
export class ClassementComponent implements OnInit {
  @Input() champ: any;
  classement: any[];

  constructor() {}

  ngOnInit() {
    console.log(this.champ);
    this.classement = _.orderBy(this.champ.participants, ['points'], ['desc']);
  }
}
