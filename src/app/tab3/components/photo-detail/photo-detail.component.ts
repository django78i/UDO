import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss'],
})
export class PhotoDetailComponent implements OnInit {
  @Input() photo: any;
  @ViewChild('slider', { read: ElementRef }) slider: ElementRef;

  sliderOpts = {
    slidesPerView: 1,
  };

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  close() {
    console.log('close');
    this.modalController.dismiss();
  }

  zoom(zoomIn: boolean) {
    let zoom = this.slider.nativeElement.swiper.zoom;
    if (zoomIn) {
      zoom.in();
    } else {
      zoom.out();
    }
  }
}
