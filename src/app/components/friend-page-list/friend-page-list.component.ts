import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-page-list',
  templateUrl: './friend-page-list.component.html',
  styleUrls: ['./friend-page-list.component.scss'],
})
export class FriendPageListComponent implements OnInit {
  @Input() friends: any[];

  constructor() {}

  ngOnInit() {}
}
