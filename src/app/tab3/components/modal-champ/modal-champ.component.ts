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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-modal-champ',
  templateUrl: './modal-champ.component.html',
  styleUrls: ['./modal-champ.component.scss'],
})
export class ModalChampComponent implements OnInit, AfterViewInit {
  @Input() championnat: any;
  @Input() user: any;
  segmentValue = 'resume';
  @ViewChild('dataPoints') dataPoints: ElementRef;
  picture: any;
  participantsList: any[];
  constructor(
    private modalCtrl: ModalController,
    public animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    console.log(this.user);
    this.participantsList = this.championnat.participants.slice(0,4);
  }

  ngAfterViewInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  segmentChanged(ev) {
    this.segmentValue = ev.detail.value;
  }

  async addPhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
    });

    // Here you get the image as result.
    const theActualPicture = image.dataUrl;
    this.picture = theActualPicture;
  }
}
