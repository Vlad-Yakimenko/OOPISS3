import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticationService} from "./_services/authentication.service";
import {User} from "./_models/user";

@Component({selector: 'app', templateUrl: 'app.component.html'})
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) {
        this.authService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
