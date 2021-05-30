import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot, CanActivate,
  Router, RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { filter, first, map, switchMap } from "rxjs/operators";

import { AuthService } from "../service";

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isDoneLoading$.pipe(
      filter(isDone => isDone),
      switchMap(() => this.authService.isAuthenticated$.pipe(
        first(),
        map((isAuthenticated) => {
          if (!isAuthenticated) {
            this.router.navigateByUrl('/login');
          }
          return isAuthenticated;
        }),
      )),
    );
  }
}
