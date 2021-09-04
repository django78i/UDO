import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
})
export class FriendsListComponent implements OnInit {
  @Output() backAction: EventEmitter<any> = new EventEmitter();
  friendsList$: Observable<any>;
  friendsList: any[] = [];
  friendsSelected: any[] = [];
  filterFriendsSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  filteredFriends: any;
  charge: any[] = [];

  constructor(public http: HttpClient) {}

  ngOnInit() {
    this.friendsList$ = combineLatest([
      this.filterFriendsSubject$,
      this.http.get<any[]>('../../assets/mocks/friendsList.json'),
    ]).pipe(
      switchMap(([friendsFilter, friends]) => {
        this.friendsList = [];
        const filterd = friends.filter((fr) =>
          fr.name.toLowerCase().includes(friendsFilter)
        );
        return this.filteredFriends ? filterd : friends;
      }),
      tap((r) => {
        this.friendsList.push(r);
      })
    );
  }

  back() {
    this.backAction.emit(true);
  }

  change(event) {
    console.log(event);
  }

  selectFriend(friend) {
    this.friendsSelected.push(friend);
  }

  sendInvitation() {
    console.log(this.friendsSelected);
  }

  filterFriends(event) {
    this.filterFriendsSubject$.next(this.filteredFriends);
  }
}
