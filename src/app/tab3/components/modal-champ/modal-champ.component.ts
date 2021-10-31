import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-champ',
  templateUrl: './modal-champ.component.html',
  styleUrls: ['./modal-champ.component.scss'],
})
export class ModalChampComponent implements OnInit, AfterViewInit {
  @Input() championnat: any;
  @Input() user: any;
  segmentValue = 'resume';
  participantsList: any[];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.user);
    this.participantsList = this.championnat.participants.slice(0, 4);
  }

  ngAfterViewInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
  }
}
