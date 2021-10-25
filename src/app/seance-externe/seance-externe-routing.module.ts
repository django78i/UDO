import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeanceExternePage } from './seance-externe.page';

const routes: Routes = [
  {
    path: '',
    component: SeanceExternePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeanceExternePageRoutingModule {}
