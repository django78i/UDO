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
  mode="";
  modeClasse="";
  constructor() {
    if(localStorage.getItem('mode')){
      if(localStorage.getItem('mode')=='landscape'){
        this.mode = 'landscape';
        this.modeClasse="aideSlideLands";
      }else{
        this.mode = 'portrait';
        this.modeClasse="aideSlide";
      }
    }else{
      this.modeClasse="aideSlide";
    }
   }

  ngOnInit() {
  }
  close(){
    window.history.back();
  }
}
