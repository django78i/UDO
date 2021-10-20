import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemarragePage } from './demarrage.page';

const routes: Routes = [
  {
    path: '',
    component: DemarragePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemarragePageRoutingModule {}
