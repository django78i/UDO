import { Injectable, NgZone } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { getAuth } from '@firebase/auth';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  constructor(
    private router: Router,
    public userService: UserService,
    public zone: NgZone,
    public navCtl: NavController
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(true);
        } else {
          this.zone.run(() => {
            this.navCtl.navigateForward('connexion');
          });
          resolve(false);
        }
      });
    });
  }
}
