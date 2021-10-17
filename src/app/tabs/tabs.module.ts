import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { MenuUserComponent } from '../components/menu-user/menu-user.component';
import { UserProfilComponent } from '../components/user-profil/user-profil.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TabsPageRoutingModule],
  declarations: [TabsPage, MenuUserComponent, UserProfilComponent],
})
export class TabsPageModule {}
