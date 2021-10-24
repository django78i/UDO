import { Component, OnInit } from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import { Plugins } from "@capacitor/core";
import { AppState } from "@capacitor/app";

const {App} = Plugins;
@Component({
  selector: 'app-external-session-now-contenu',
  templateUrl: './external-session-now.component.html',
  styleUrls: ['./external-session-now.component.scss'],
})
export class ExternalSessionNowComponent implements OnInit {
  isPicture: boolean = true;
  listExtenalApp=[];
  constructor(private modalCtr: ModalController,private platform: Platform

             ) { }

  ngOnInit() {
    this.listExtenalApp=[
      {
        img:'assets/logo/logo_strava.png',
        name:'Strava',
        appId:'com.strava',
        platform: 'android'
      },
      {img:'assets/logo/google_fit.png',name:'Google Fit',appId:'com.google.android.apps.fitness',platform:'android'},

      {
        img:'assets/logo/huawei_health.png',
        name:'Huawei Health',
        appId:'com.huawei.health',
        platform: 'android'
      },
      {
        img:'assets/logo/mifit.png',
        name:'Mi Fit',
        appId:'com.xiaomi.hm.health',
        platform: 'android'
      },
      {
        img:'assets/logo/samsung.png',
        name:'Samsung App',
        appId:'com.sec.android.app.shealth',
        platform: 'android'
      }
    ];
console.log(this.platform.platforms());
  if (this.platform.is('ios')) {
    this.listExtenalApp=[
      {
        img:'assets/logo/logo_strava.png',
        name:'Strava',
        appId:'com.strava',
        platform: 'ios'
      },
      {
        img:'assets/logo/apple_fitnes.png',
        name:'Apple Health',
        appId:'com.sec.android.app.shealth',
        platform: 'ios'
      }

    ];
    } else if (this.platform.is('android')) {
    console.log('android');
// fallback to browser APIs
    }

  }

  async close() {
    const closeModal: string = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

  async openExternalApp(appId: string){
    var ret = await App.canOpenUrl({ url: appId });
    var retx = await App.openUrl({ url:appId });
    console.log('Open url response: ', ret);
  }
}
