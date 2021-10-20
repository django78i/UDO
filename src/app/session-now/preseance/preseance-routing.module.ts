import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreseancePage } from './preseance.page';

const routes: Routes = [
  {
    path: '',
    component: PreseancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreseancePageRoutingModule {}
