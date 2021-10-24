import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ChampionnatsService } from 'src/app/services/championnats.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
})
export class FriendsListComponent implements OnInit {
  @Output() backAction: EventEmitter<any> = new EventEmitter();
  @Output() friendList: EventEmitter<any> = new EventEmitter();
  friendsList$: Observable<any[]>;
  friendsList: any[] = [];
  friendsSelected: any[] = [];
  filterFriendsSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  filteredFriends: any;
  charge: any[] = [];

  @Input() createur: any;
  @Input() type: any;
  @Input() range: any;
  @Input() acitivities: any;

  constructor(
    public http: HttpClient,
    public userService: UserService,
    public champService: ChampionnatsService
  ) {}

  ngOnInit() {
    console.log(this.range);
    this.friendsList$ = this.champService.friendsListSubject$.pipe(
      tap((r) => console.log(r))
    );
  }

  back() {
    console.log('back');
    this.backAction.emit(true);
  }

  change(event) {
    console.log(event);
  }

  selectFriend(friend) {
    friend = { ...friend, etat: 'en attente' };
    const ind = this.friendsSelected.findIndex((fr) => fr.name == friend.name);
    ind != -1
      ? this.friendsSelected.splice(ind, 1)
      : this.friendsSelected.push(friend);
    console.log(this.friendsSelected);
    this.friendList.emit(this.friendsSelected);
  }

  sendInvitation() {
    console.log(this.friendsSelected);
  }

  filterFriends(event) {
    this.filterFriendsSubject$.next(this.filteredFriends);
  }
}
