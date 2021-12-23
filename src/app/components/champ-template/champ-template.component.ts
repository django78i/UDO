import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-champ-template',
  templateUrl: './champ-template.component.html',
  styleUrls: ['./champ-template.component.scss'],
})
export class ChampTemplateComponent implements OnInit, OnChanges {
  @Input() championnat: any;
  @Input() user: any;
  @Input() userEncours: any;
  @Input() participantsList: any;
  @Input() segmentValue: string;
  @Input() lastVisible: any;
  @Input() feed: any;
  @Input() competition: any;
  @Input() loadFeed: any;

  @Output() friends: EventEmitter<boolean> = new EventEmitter();
  @Output() start: EventEmitter<any> = new EventEmitter();
  @Output() seance: EventEmitter<any> = new EventEmitter();
  @Output() chatRoom: EventEmitter<any> = new EventEmitter();
  @Output() join: EventEmitter<any> = new EventEmitter();
  @Output() closed: EventEmitter<any> = new EventEmitter();

  // segmentValue = 'resume';

  constructor() {}

  ngOnInit() {}
  ngOnChanges() {
    console.log(
      this.loadFeed,
      this.user,
      this.userEncours,
      this.participantsList,
      this.championnat, this.competition
    );
  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
  }

  close() {
    this.closed.emit([]);
  }

  startChamp() {
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
