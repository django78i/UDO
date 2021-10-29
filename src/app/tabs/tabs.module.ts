import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';
import { UserProfilComponent } from '../components/user-profil/user-profil.component';
import {AppLauncher}  from '@ionic-native/app-launcher/ngx';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TabsPageRoutingModule],
  declarations: [TabsPage, MenuUserComponent, UserProfilComponent],
  providers: [AppLauncher]
})
export class TabsPageModule {}
