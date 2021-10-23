import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteGuardService } from './services/route-guard.service';
import {SessionNowPageRoutingModule} from "./session-now/session-now-routing.module";

const routes: Routes = [
  {
    path: '',
    // canActivate: [RouteGuardService],
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'connexion',
    loadChildren: () =>
      import('./connexion/connexion.module').then((m) => m.ConnexionPageModule),
  },
  {
    path: 'session-now',
    loadChildren: () =>
      import('./session-now/session-now-routing.module').then((m) => m.SessionNowPageRoutingModule),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
