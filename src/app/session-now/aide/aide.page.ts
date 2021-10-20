import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aide',
  templateUrl: './aide.page.html',
  styleUrls: ['./aide.page.scss'],
})
export class AidePage implements OnInit {
  slideOptsOne: any = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };
  constructor() { }

  ngOnInit() {
  }
  close(){
    window.history.back();
  }
}
