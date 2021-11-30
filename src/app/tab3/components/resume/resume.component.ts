import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
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
