import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AnimationController, ModalController, NavParams, Animation } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-modal-champ',
  templateUrl: './modal-champ.component.html',
  styleUrls: ['./modal-champ.component.scss'],
})
export class ModalChampComponent implements OnInit, AfterViewInit {

  @Input() championnat: any;
  segmentValue = "resume";

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private renderer: Renderer2,
    public animationCtrl: AnimationController
  ) { }

  ngOnInit() {
    console.log(this.championnat)
  }

  ngAfterViewInit() {
  }

  close() {
    this.modalCtrl.dismiss();


  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
  }


}
