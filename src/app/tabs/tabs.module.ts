import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';
import { UserProfilComponent } from '../components/user-profil/user-profil.component';
import { AppLauncher } from '@ionic-native/app-launcher/ngx';
import { ExternalSessionNowComponent } from '../session-now/external-session-now/external-session-now.component';
import { ExternalSessionNowLoaderPage } from '../session-now/external-session-now/external-session-now-loader/external-session-now-loader.page';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { Health } from '@ionic-native/health/ngx';
import { CreatePostComponent } from './component/create-post/create-post.component';
import { FriendPageListComponent } from '../components/friend-page-list/friend-page-list.component';
import { UserParamComponent } from '../components/user-param/user-param.component';
import { TimeRelativePipe } from '../pipe/time-relative.pipe';
import { AddContenuComponent } from '../session-now/add-contenu/add-contenu.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    RoundProgressModule,
  ],
  declarations: [
    TabsPage,
    MenuUserComponent,
    UserProfilComponent,
    ExternalSessionNowComponent,
    ExternalSessionNowLoaderPage,
    CreatePostComponent,
    FriendPageListComponent,
    UserParamComponent,
    AddContenuComponent
    // TimeRelativePipe
  ],
  providers: [AppLauncher, Health],
})
export class TabsPageModule {}
