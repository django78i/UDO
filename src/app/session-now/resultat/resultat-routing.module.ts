import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultatPage } from './resultat.page';

const routes: Routes = [
  {
    path: '',
    component: ResultatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultatPageRoutingModule {}
