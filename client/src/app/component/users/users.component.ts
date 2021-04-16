import { Component, OnInit } from '@angular/core';
import { Abonent } from '../../shared/interface';
import { UserService } from '../../service/user.service';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit { 
  public abonents: Abonent[] = [];

  constructor(
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService
      .getAbonents()
      .subscribe(abonents => this.abonents = abonents);
  }

}
