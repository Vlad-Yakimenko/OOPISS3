import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Dish} from "../_models/dish";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    url = 'http://localhost:8080/dishes';

    constructor(private httpClient: HttpClient) {
    }

    getAllDishes(): Observable<Dish[]> {
        return this.httpClient.get<Dish[]>("http://localhost:8080/dishes");
    }
}
