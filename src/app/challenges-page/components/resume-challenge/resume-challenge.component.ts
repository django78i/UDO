import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-resume-challenge',
  templateUrl: './resume-challenge.component.html',
  styleUrls: ['./resume-challenge.component.scss'],
})
export class ResumeChallengeComponent implements OnInit, OnChanges {
  @Input() challenge: any;
  @Input() userEncours: any;
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
