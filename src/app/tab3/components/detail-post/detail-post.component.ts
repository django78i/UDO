import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChampionnatsService } from 'src/app/services/championnats.service';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss'],
})
export class DetailPostComponent implements OnInit {
  @Input() post: any;
  @Input() user: any;
  segmentValue = 'resume';
  message: any;
  constructor(
    public modalCtrl: ModalController,
    public ref: ChangeDetectorRef,
    public champService: ChampionnatsService
  ) {}

  ngOnInit() {
    console.log(this.post, this.user);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  segmentChanged(ev) {
    console.log(ev);
    this.segmentValue = ev.detail.value;
    this.ref.detectChanges();
  }

  send() {
    const message = {
      text: this.message,
      date: new Date(),
      sender: this.user,
    };
    this.champService.sendMessage(message, this.post.uid);
    this.message = '';
  }
}
