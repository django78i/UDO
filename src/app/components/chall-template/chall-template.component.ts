import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-chall-template',
  templateUrl: './chall-template.component.html',
  styleUrls: ['./chall-template.component.scss'],
})
export class ChallTemplateComponent implements OnInit, OnChanges {
  @Input() challenge: any;
  @Input() user: any;
  @Input() userEncours: any;
  @Input() participantsList: any;
  @Input() segmentValue: string ="résumé";

  @Output() friends: EventEmitter<boolean> = new EventEmitter();
  @Output() start: EventEmitter<any> = new EventEmitter();
  @Output() seance: EventEmitter<any> = new EventEmitter();
  @Output() chatRoom: EventEmitter<any> = new EventEmitter();
  @Output() join: EventEmitter<any> = new EventEmitter();
  @Output() closed: EventEmitter<any> = new EventEmitter();

  // segmentValue = 'resume';
  startDate: any;
  constructor() {}

  ngOnInit() {
    this.startDate = moment(this.challenge.dateDemarrage).fromNow();
  }

  ngOnChanges() {
    console.log(this.challenge, this.segmentValue);
  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
  }

  close() {
    this.closed.emit([]);
  }

  startChall() {
    this.start.emit([]);
  }
  participer() {
    this.join.emit([]);
  }
  seanceNow() {
    this.seance.emit([]);
  }
  addFriend() {
    this.friends.emit(true);
  }
  removeFriend() {
    this.friends.emit(false);
  }
  chat() {
    this.chatRoom.emit();
  }
}
