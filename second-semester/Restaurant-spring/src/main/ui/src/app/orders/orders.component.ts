import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {MenuService} from "../_services/menu.service";
import {OrderService} from "../_services/order.service";
import {OrderReadDto} from "../_dto/order/orderReadDto";
import {OAuthService} from "angular-oauth2-oidc";
import {AuthService} from "../_services/auth.service";

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {

    orders: OrderReadDto[];

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private authenticationService: AuthService,
                private menuService: MenuService,
                private orderService: OrderService,
                private oauthService: OAuthService) {

        this.oauthService.loadDiscoveryDocument();

    }

    ngOnInit(): void {
        this.getAllOrders();
    }

    private getAllOrders() {
        this.orderService.getAllOrders().pipe().subscribe(
            data => {
                this.orders = data;
            }
        )
    }
}
