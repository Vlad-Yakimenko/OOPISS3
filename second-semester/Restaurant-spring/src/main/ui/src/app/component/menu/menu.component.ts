import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";
import { first } from "rxjs/operators";

import { DishReadWriteDto } from "../../dto/dish";
import { 
  MenuService, OrderService, AuthService 
} from "../../service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  orderForm: FormGroup;
  dishes: DishReadWriteDto[];
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthService,
    private menuService: MenuService,
    private orderService: OrderService,
    private oauthService: OAuthService,
  ) {
    //console.log(this.oauthService.getIdentityClaims());
  }

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      orderDishes: this.formBuilder.array([])
    });
    this.getAllDishes();
  }

  getAllDishes(): void {
    this.menuService.getAllDishes().pipe().subscribe(
      data => {
        this.dishes = data;

        this.dishes.forEach(dish => {
          const order = this.formBuilder.group({
            dishName: dish.name,
            isOrdered: false,
            amount: 0
          })

          this.orderDishes.push(order)
        })
      }
    );
  }

  get orderDishes() {
    return this.orderForm.get('orderDishes') as FormArray
  }

  onSubmit(): void {
    this.submitted = true;
    this.loading = true;

    let formData = this.orderForm.value.orderDishes;
    //console.log(formData)
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        delete formData[key]
      }
    }

    const orderDishes = formData.filter(orderDish => orderDish.isOrdered)
      .map(dish => {
        return {
          dishName: dish.dishName,
          quantity: dish.amount
        }
      })

    //console.log(orderDishes)
    const order = {
      username: null,
      dishes: orderDishes,
      status: "PENDING"
    }

    this.orderService.checkout(order)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/orders']);
        },
        error => {
          this.loading = false;
        });
  }
}
