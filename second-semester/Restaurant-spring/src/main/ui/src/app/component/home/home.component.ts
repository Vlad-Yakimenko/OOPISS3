import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { User } from 'src/app/dto/user';
import { AuthService, UserService } from "../../service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public user: User;
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) { }

  ngOnInit() {
    const username = this.authService.identityClaims['preferred_username'];
    this.userService.getUserInfo(username).subscribe(
      (user) => this.user = user,
    );
  }
}
