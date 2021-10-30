import { Component, OnInit } from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import {Router} from '@angular/router';



@Component({
  selector: 'app-external-session-now-contenu',
  templateUrl: './external-session-now.component.html',
  styleUrls: ['./external-session-now.component.scss'],
})
export class ExternalSessionNowComponent implements OnInit {
  isPicture = true;
  listExtenalApp=[];

  constructor(private modalCtr: ModalController,
              private platform: Platform,
              private appLauncher: AppLauncher,
              private router: Router

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
        appId:'strava://',
        platform: 'ios'
      },
      {
        img:'assets/logo/apple_fitnes.png',
        name:'Apple Health',
        appId:'x-apple-health://',
        platform: 'ios'
      }

    ];
    } else if (this.platform.is('android')) {
    console.log('android');
// fallback to browser APIs
    }

  }

  async close() {
    const closeModal = 'Modal Closed';
    await this.modalCtr.dismiss(closeModal);
  }

   openExternalApp(appId: string,appName: string){
    const  options: AppLauncherOptions = {};
     if(this.platform.is('ios')) {
       options.uri = appId ; // 'fb://'
     } else {
       options.packageName = appId;
     }

     this.appLauncher.canLaunch(options)
       .then((canLaunch: boolean) => this.launchExternalApp(options,appName))
       .catch((error: any) => console.error(appName+ ' is not available'));
  }
  launchExternalApp(options,appName){
    this.appLauncher.launch(options)
      .then((launch: boolean)=>{console.log(appName +' is open'); })
      .catch((error: any) => console.error('Error when trying to open '+appName));
  }

  gotoLoaderPage( app: any ){
    this.router.navigate(['session-now/external-session-now-loader'],{queryParams:{
        appName:app.name,
        appImg:app.img,
        appId:app.appId
    }});
    this.close();
  }
}
