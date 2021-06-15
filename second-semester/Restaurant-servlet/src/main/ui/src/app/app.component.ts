import {Component, OnInit} from '@angular/core';

import {AuthService} from "./service/";
import {User} from "./shared/dto/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
