import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
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
  @ViewChildren('iconSelected') selectedIcon: QueryList<ElementRef>;
  indice: number;

  constructor(
    public http: HttpClient,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.emojisList$ = this.http
      .get<any[]>('../../../assets/mocks/emojis.json')
      .pipe(tap((r) => console.log(r)));
  }

  choice(ev, i) {
    this.emoji = ev;
    this.indice = i;
    console.log(this.indice, i);
  }

  send() {
    this.modalController.dismiss(this.emoji);
  }

  close() {
    this.modalController.dismiss();
  }
}
