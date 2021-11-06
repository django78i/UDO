import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
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
  @Output() champCreate: EventEmitter<any> = new EventEmitter();
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
  subscription: Subscription;
  constructor(
    public http: HttpClient,
    public userService: UserService,
    public champService: ChampionnatsService
  ) {}

  ngOnInit() {
    this.subscription = this.champService.friendsListSubject$.subscribe(
      (friends) => {
        this.friendsList = friends;
      }
    );
    console.log(this.createur);
  }

  back() {
    this.backAction.emit(true);
  }

  selectFriend(friend) {
    this.userService.addFriend(friend, this.createur);

    // console.log(friend, this.friendsSelected);
    // friend = { ...friend, etat: 'en attente' };
    // const ind = this.friendsSelected.findIndex(
    //   (fr) => fr.userName == friend.userName
    // );
    // ind != -1
    //   ? this.friendsSelected.splice(ind, 1)
    //   : this.friendsSelected.push(friend);
    // console.log(this.friendsSelected);
    // this.friendList.emit(this.friendsSelected);
  }

  clear(event) {
    this.subscription = this.champService.friendsListSubject$.subscribe(
      (friends) => {
        this.friendsList = friends;
      }
    );
  }

  filterFriends(ev) {
    let table = [];
    console.log(ev);
    this.friendsList.map((fr) => {
      if (fr.userName) {
        fr.userName.includes(ev.detail.value) ? table.push(fr) : '';
      }
    });
    console.log(table);
    this.friendsList = table;
    this.filterFriendsSubject$.next(table);
  }

  create() {
    this.champCreate.emit('true');
  }
}
