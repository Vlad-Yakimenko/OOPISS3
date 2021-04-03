import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Order} from "../_models/order";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    url = 'http://localhost:8080/order';

    constructor(private httpClient: HttpClient) {
    }

    getAllOrdersByUserId(id: number): Observable<Order[]> {
        return this.httpClient.get<Order[]>("http://localhost:8080/order?id=" + id);
    }
}
