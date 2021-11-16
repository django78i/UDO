import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { AppLauncher } from '@ionic-native/app-launcher/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MusicFeedService } from './services/music-feed.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment.prod';
import { VideoCapturePlus } from '@ionic-native/video-capture-plus/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { TimeRelativePipe } from './pipe/time-relative.pipe';
import { TimeChampPipe } from './pipe/time-champ.pipe';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    VideoPlayer,
    AppLauncher,
    MusicFeedService,
    GooglePlus,
    ScreenOrientation,
    VideoCapturePlus,
    VideoEditor,
    MediaCapture,
    NativeStorage,
    BackgroundMode
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
