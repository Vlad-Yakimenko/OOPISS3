import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../_services/alert.service";
import {OAuthService} from "angular-oauth2-oidc";
import {AuthService} from "../_services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private alertService: AlertService,
    ) {

        console.log("login constructor")
        // let currentUserValue = this.authenticationService.currentUserValue;
        // if (currentUserValue) {
        //     if (currentUserValue.role === "ADMIN") {
        //         this.router.navigate(['admin']);
        //         console.log("admin redirect")
        //     } else if (currentUserValue.role === "USER") {
        //         this.router.navigate(['']);
        //         console.log("user redirect")
        //     }
        // }
        // this.oauthService.initLoginFlow();
        // this.oauthService.loadDiscoveryDocumentAndTryLogin().then(isLoggedIn => {
        //     console.log("inside")
        //     if (isLoggedIn) {
        //         this.oauthService.setupAutomaticSilentRefresh();
        //         if you don't use clearHashAfterLogin from angular-oauth2-oidc you can remove the #hash or route to some other URL manually:
        //         const lazyPath = this.injector.get(LAZY_PATH) as string;
        //         this.injector.get(Router).navigateByUrl(lazyPath + '/a') // remove login hash fragments from url
        //           .then(() => resolveFn()); // callback only once login state is resolved
            // } else {
            // }
        // })

        // oauthService.initLoginFlow()


    }

    // ngOnInit(): void {
    //     this.oauthService.tryLogin();
    // }

    login() {
        this.authService.login()
    }

    logout() {
       this.authService.logout()
    }

    ngOnInit(): void {
        // this.oauthService.tryLogin();

    }
}
