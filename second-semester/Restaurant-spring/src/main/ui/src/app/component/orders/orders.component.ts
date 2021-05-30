import { Component, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { OAuthService } from "angular-oauth2-oidc";

import { 
  OrderService, AuthService 
} from "../../service";
import { OrderReadDto } from "../../dto/order";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {
  orders: OrderReadDto[];

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private orderService: OrderService,
    private oauthService: OAuthService
  ) { }

  ngOnInit(): void { }
}
