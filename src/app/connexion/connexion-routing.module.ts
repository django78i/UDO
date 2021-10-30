import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginModalComponent } from './components/login-modal/login/login-modal.component';

import { ConnexionPage } from './connexion.page';

const routes: Routes = [
  {
    path: '',
    component: ConnexionPage,
    // children: [
    //   {
    //     path: 'onboarding',
    //     loadChildren: () =>
    //       import('./components/login-modal/login/login.module').then(
    //         (m) => m.LoginModule
    //       ),
    //   },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnexionPageRoutingModule {}
