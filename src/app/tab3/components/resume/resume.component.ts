import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit {
  @Input() champ: any;
  userInfo: any;
  constructor() {}

  ngOnInit() {
    this.userInfo = this.champ.participants.find(
      (part) => part.uid == this.champ.createur.uid
    );
  }
}
