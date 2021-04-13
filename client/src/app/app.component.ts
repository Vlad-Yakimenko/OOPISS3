import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './service';

@Component({ 
  selector: 'app-root', 
  templateUrl: './app.component.html' 
})
export class AppComponent {
  currentUser: any;

  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(user => this.currentUser = user);
  }

  signOut() {
    this.authenticationService.signOut();
    this.router.navigate(['/login']);
  }
}