import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChallengesPagePage } from './challenges-page.page';

const routes: Routes = [
  {
    path: '',
    component: ChallengesPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChallengesPagePageRoutingModule {}
