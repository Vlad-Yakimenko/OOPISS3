import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthenticationService} from "../_services/authentication.service";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        console.log("Guard");
        const currentUser = this.authService.currentUserValue;
        if (currentUser && currentUser.role === 'ADMIN') {
            return true;
        } else {
            console.log("Guard redirect: " + state.url);
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }
    }
}
