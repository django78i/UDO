import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AnimationController,
  ModalController,
  NavParams,
} from '@ionic/angular';

@Component({
  selector: 'app-modal-champ',
  templateUrl: './modal-champ.component.html',
  styleUrls: ['./modal-champ.component.scss'],
})
export class ModalChampComponent implements OnInit, AfterViewInit {
  @Input() championnat: any;
  segmentValue = 'resume';
  @ViewChild('dataPoints') dataPoints: ElementRef;
  // dataPoints: '100,50 200,50 270,150 150,250 30,150';
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private renderer: Renderer2,
    public animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    console.log(this.championnat);
  }

  ngAfterViewInit() {
    // this.dataPoints.nativeElement.setAttribute(
    //   'points',
    //   '100,50 200,50 270,150 150,250 30,150'
    // );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
  }
}
