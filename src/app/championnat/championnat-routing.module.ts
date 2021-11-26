import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChampionnatPage } from './championnat.page';

const routes: Routes = [
  {
    path: '',
    component: ChampionnatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChampionnatPageRoutingModule {}
