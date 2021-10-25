import { Injectable, NgZone } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { getAuth } from '@firebase/auth';
import { Observable } from 'rxjs';
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  constructor(
    private router: Router,
    public userService: UserService,
    public zone: NgZone
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const auth = getAuth();
    console.log('ici');
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(true);
        } else {
          console.log('User is not logged in');
          this.zone.run(() => {
            this.router.navigate(['connexion']);
          });
          resolve(false);
        }
      });
    });
  }
}
