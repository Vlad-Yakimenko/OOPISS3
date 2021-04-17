import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './service';
import { Role } from './shared/enum';
import { CurrentUser } from './shared/interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentUser: CurrentUser;

  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
  }

  logOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser.role === Role.Admin;
  }
}