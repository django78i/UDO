import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeanceExterneFinalPage } from './seance-externe-final.page';

const routes: Routes = [
  {
    path: '',
    component: SeanceExterneFinalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeanceExterneFinalPageRoutingModule {}
