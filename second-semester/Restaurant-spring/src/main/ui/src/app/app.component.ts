import { Component, OnInit } from '@angular/core';
import { from, Observable, of } from "rxjs";
import { AuthService } from "./_services/auth.service";
import { User } from "./_dto/user/user";
import { UserService } from "./_services/user.service";
import { mergeMap } from "rxjs/operators";

@Component({ 
  selector: 'app', 
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  // private authConfig: AuthConfig = {
  //     issuer: 'http://localhost:8180/auth/realms/restaurant',
  //     redirectUri: window.location.origin + "/login",
  //     clientId: 'restaurant-ui',
  //     scope: 'openid profile email offline_access roles',
  //     responseType: 'code',
  //     disableAtHashCheck: true,
  //     showDebugInformation: true,
  //     requireHttps: false
  // }
  //
  // constructor(
  //     private router: Router,
  //     // private authService: AuthenticationService,
  //     private oauthService: OAuthService
  // ) {
  //     // this.authService.currentUser.subscribe(x => this.currentUser = x);
  //
  //     console.log("app cons")
  //
  //     this.oauthService.configure(this.authConfig);
  //     this.oauthService.tokenValidationHandler = new NullValidationHandler();
  //     // this.oauthService.loadDiscoveryDocumentAndTryLogin();
  //     console.log(oauthService.getAccessToken())
  // }
  //
  // logout() {
  //     // this.authService.logout();
  //     // this.router.navigate(['/login']);
  //     this.oauthService.logOut();
  // }

  isAuthenticated: Observable<boolean>;
  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;
  isUserAuthenticated: Observable<boolean>;
  isAdminAuthenticated: Observable<boolean>;
  currentUser: User;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated$;
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.isUserAuthenticated = this.authService.isUserAuthenticated$;
    this.isAdminAuthenticated = this.authService.isAdminAuthenticated$;

    from(this.authService.runInitialLoginSequence())
      .pipe(mergeMap(() => {
        if (this.authService.hasValidToken()) {
          console.log("what")
          let username = this.authService.identityClaims['preferred_username'];
          return this.userService.getUserInfo(username)
        }

        return of(null)
      }))
      .subscribe(user => {
        this.currentUser = user;
        console.log(this.currentUser)
      });
  }

  ngOnInit(): void {
    this.userService.getAll()
  }


  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  refresh() {
    this.authService.refresh();
  }

  reload() {
    console.log('reload')
    window.location.reload();
  }

  clearStorage() {
    localStorage.clear();
  }

  get hasValidToken() {
    return this.authService.hasValidToken();
  }

  get accessToken() {
    return this.authService.accessToken;
  }

  get refreshToken() {
    return this.authService.refreshToken;
  }
}
