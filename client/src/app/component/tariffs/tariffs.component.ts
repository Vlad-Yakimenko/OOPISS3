import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TariffService, UserService } from '../../service';
import { Tariff, User } from '../../shared/interface';

@Component({
  selector: 'app-tariffs',
  templateUrl: './tariffs.component.html',
  styleUrls: ['./tariffs.component.scss']
})
export class TariffsComponent implements OnInit {
  tariffs: Tariff[] = [];
  user: User;

  constructor(
    private readonly tariffService: TariffService,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.tariffService.getTariffs().subscribe(tariffs => this.tariffs = tariffs);
    this.userService
      .getUserById(this.authenticationService.currentUserValue?.userId)
      .subscribe(user => {
        this.user = user;
      });
  }

  onUserChange(changedUser: User): void {
    this.user = changedUser; 
  }
}
