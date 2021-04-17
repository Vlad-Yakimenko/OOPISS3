import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/interface';
import { UserService } from '../../service/user.service';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit { 
  public abonents: User[] = [];

  constructor(
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService
      .getAbonents()
      .subscribe(abonents => this.abonents = abonents);
  }
}
