import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthenticationService} from "../_services/authentication.service";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class HomeGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        console.log("Home Guard");
        const currentUser = this.authService.currentUserValue;
        if (currentUser && currentUser.role === "USER") {
            return true;
        } else {
            console.log("Home Guard redirect: " + state.url);
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }
    }
}
