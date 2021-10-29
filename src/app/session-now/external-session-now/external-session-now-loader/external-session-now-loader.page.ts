import { Component, OnInit } from '@angular/core';
import {AppLauncher, AppLauncherOptions} from '@ionic-native/app-launcher/ngx';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-external-session-now-loader',
  templateUrl: './external-session-now-loader.page.html',
  styleUrls: ['./external-session-now-loader.page.scss'],
})
export class ExternalSessionNowLoaderPage implements OnInit {

  constructor( private platform: Platform, private appLauncher: AppLauncher) { }
  listExtenalApp=[];
  ngOnInit() {
  //  setTimeout(this.openExternalApp('',''),3000);
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
}
