import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompetitionsListComponent } from './competitions-list.component';

const routes: Routes = [
  {
    path: '',
    component: CompetitionsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetitionsListPageRoutingModule {}
