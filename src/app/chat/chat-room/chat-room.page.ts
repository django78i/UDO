import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  @Input() contact: any;
  @Input() currentUser: any;

  constructor(
    private route: ActivatedRoute,
    public modalCtl: ModalController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.contact = JSON.parse(params['contact']);
      this.currentUser = JSON.parse(params['user']);
      console.log(this.contact, this.currentUser);
    });
  }
}
