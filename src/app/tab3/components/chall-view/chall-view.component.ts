import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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

  constructor(public http: HttpClient) {}

  ngOnInit() {
    // this.challenges = this.http.get('../../assets/mocks/challenges.json').pipe(
    //   tap((r) => {
    //     this.bannData = r[0];
    //   })
    // );
  }
}
