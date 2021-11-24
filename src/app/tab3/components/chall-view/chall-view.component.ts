import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-chall-view',
  templateUrl: './chall-view.component.html',
  styleUrls: ['./chall-view.component.scss'],
})
export class ChallViewComponent implements OnInit {
  bannData: any;
  @Input() challenges: any[];
  @Input() challEncours: any[];
  @Output() createChall: EventEmitter<any> = new EventEmitter();
  @Output() challengeId: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient) {}

  ngOnInit() {
    // this.challenges = this.http.get('../../assets/mocks/challenges.json').pipe(
    //   tap((r) => {
    //     this.bannData = r[0];
    //   })
    // );
  }

  buttonClick() {
    this.createChall.emit();
  }

  chooseChallenge(ev) {
    console.log(ev)
    this.challengeId.emit(ev);
  }
}
