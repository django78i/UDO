import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompteurPage } from './compteur.page';

const routes: Routes = [
  {
    path: '',
    component: CompteurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompteurPageRoutingModule {}
