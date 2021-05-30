import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../_services/auth.service";

@Injectable({ providedIn: 'root' })
export class MenuGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isDoneLoading$.pipe(
      filter(isDone => isDone),
      switchMap(_ => this.authService.isUserAuthenticated$),
      tap(isUserAuthenticated => isUserAuthenticated ||
        this.authService.isAuthenticated$ ? false : this.authService.login(state.url))
    );
  }
}
