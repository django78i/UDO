import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.scss'],
})
export class EmojisComponent implements OnInit {
  emojisList$: Observable<any[]>;

  constructor(public http: HttpClient) {}

  ngOnInit() {
    this.emojisList$ = this.http
      .get<any[]>('../../../assets/mocks/emojis.json')
  }
}
