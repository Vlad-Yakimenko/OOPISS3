import {Component, OnInit} from '@angular/core';
import {User} from "../_models/user";
import {Dish} from "../_models/dish";
import {AuthenticationService} from "../_services/authentication.service";
import {MenuService} from "../_services/menu.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

    user: User;
    dishes: Dish[];

    constructor(private authenticationService: AuthenticationService,
                private menuService: MenuService) {
    }

    ngOnInit(): void {
        this.getAllRooms();
    }

    getAllRooms(): void {
        this.menuService.getAllDishes().pipe().subscribe(
            data => {
                this.dishes = data;
            }
        );
    }

    logout(): void {
        this.authenticationService.logout();
    }
}
