import {map, mergeMap, tap} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {OAuthService} from 'angular-oauth2-oidc';

import {AuthService, OrderService, UserService} from '../../service';
import {OrderReadDto} from '../../shared/dto/order';
import {User} from '../../shared/dto/user';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: OrderReadDto[] = [];
  user: User & { isAdmin: boolean } = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
    private readonly oauthService: OAuthService,
    private readonly userService: UserService,
  ) {
  }

  ngOnInit(): void {
    const customer = this.authService.currentUserValue;
    const username = customer.username;

    if (customer.role.includes('app-admin')) {
      this.userService.getUserInfo(username).pipe(
        tap((user) => {
          this.user = {
            ...user,
            isAdmin: true,
          };
        }),
        mergeMap(() => this.orderService.getAllOrders()),
        map(orders => orders.map(order => ({
          ...order,
          dishes: order.dishes.filter(dish => dish.quantity > 0),
        }))),
        map((orders) => orders.filter(order => order.totalSum > 0)),
        tap((orders) => console.log(orders)),
      ).subscribe(
        orders => this.orders = orders,
      );
    } else {
      this.userService.getUserInfo(username).pipe(
        tap((user) => {
          this.user = {
            ...user,
            isAdmin: false,
          };
        }),
        map(user => user.username),
        mergeMap((userId) => this.orderService.getAllOrdersByUsername(username)),
        map(orders => orders.map(order => ({
          ...order,
          dishes: order.dishes.filter(dish => dish.quantity > 0),
        }))),
        // map((orders) => orders.filter(order => order.totalSum > 0)),
        // tap((orders) => console.log(orders)),
      ).subscribe(
        (orders) => this.orders = orders,
      );
    }
  }

  sortByAsc(): void {
    this.orders.sort((a, b) => a.totalSum - b.totalSum);
  }

  sortByDesc(): void {
    this.orders.sort((a, b) => b.totalSum - a.totalSum);
  }
}
