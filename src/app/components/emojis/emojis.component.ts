import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.scss'],
})
export class EmojisComponent implements OnInit {
  emojisList$: Observable<any[]>;
  emoji: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public http: HttpClient,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.emojisList$ = this.http.get<any[]>(
      '../../../assets/mocks/emojis.json'
    );
  }

  choice(ev) {
    this.emoji = ev;
  }

  send() {
    this.modalController.dismiss(this.emoji);
  }
}
