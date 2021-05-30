import { Component, OnInit } from '@angular/core';
import { from, Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";

import {
  AuthService, UserService
} from "./service/";
import { User } from "./dto/user";

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;
  isUserAuthenticated: Observable<boolean>;
  isAdminAuthenticated: Observable<boolean>;
  currentUser: User;
  debugOn: boolean = false; //change it for debug purposes

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    this.isAuthenticated = this.authService.isAuthenticated$;
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.isUserAuthenticated = this.authService.isUserAuthenticated$;
    this.isAdminAuthenticated = this.authService.isAdminAuthenticated$;
  }

  ngOnInit() {
    from(this.authService.runInitialLoginSequence())
      .pipe(
        mergeMap(() => {
          if (this.authService.hasValidToken()) {
            const username = this.authService.identityClaims['preferred_username'];
            return this.userService.getUserInfo(username)
          }

          return of(null);
        })
      )
      .subscribe(user => {
        this.currentUser = user;
      });
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
    console.log('reload');
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
