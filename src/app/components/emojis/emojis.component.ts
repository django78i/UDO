import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.scss'],
})
export class EmojisComponent implements OnInit {
  emojisList$: Observable<any[]>;
  emoji: any;

  constructor(
    public http: HttpClient,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.emojisList$ = this.http
      .get<any[]>('../../../assets/mocks/emojis.json')
      .pipe(tap((r) => console.log(r)));
  }

  choice(ev) {
    this.emoji = ev;
  }

  send() {
    this.modalController.dismiss(this.emoji);
  }

  close() {
    this.modalController.dismiss();
  }
}
