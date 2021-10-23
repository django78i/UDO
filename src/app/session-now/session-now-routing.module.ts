import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  /*{
    path: 'accueil',
    loadChildren: () => import('./accueil/accueil.module').then( m => m.AccueilPageModule)
  },*/
  {
    path: '',
    loadChildren: () => import('./preseance/preseance.module').then( m => m.PreseancePageModule)
  },
  {
    path: 'counter',
    loadChildren: () => import('./compteur/compteur.module').then( m => m.CompteurPageModule)
  },
  {
    path: 'demarrage',
    loadChildren: () => import('./demarrage/demarrage.module').then( m => m.DemarragePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./aide/aide.module').then( m => m.AidePageModule)
  }
];

@NgModule({
  imports: [    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class SessionNowPageRoutingModule {}