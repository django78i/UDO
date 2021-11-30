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

  @Output() friends: EventEmitter<boolean> = new EventEmitter();
  @Output() start: EventEmitter<any> = new EventEmitter();
  @Output() seance: EventEmitter<any> = new EventEmitter();
  @Output() chatRoom: EventEmitter<any> = new EventEmitter();
  @Output() join: EventEmitter<any> = new EventEmitter();
  @Output() closed: EventEmitter<any> = new EventEmitter();

  segmentValue = 'resume';

  constructor() {}

  ngOnInit() {}
  ngOnChanges() {
    console.log(
      this.user,
      this.userEncours,
      this.participantsList,
      this.championnat
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
