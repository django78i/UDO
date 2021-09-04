import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit {

  @Input() champ: any;

  constructor() {

   }

  ngOnInit() {
    console.log(this.champ)
   }

}
