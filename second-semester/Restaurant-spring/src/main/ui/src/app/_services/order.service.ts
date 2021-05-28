import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {OrderWriteDto} from "../_dto/order/orderWriteDto";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from '../app-settings';
import {OrderReadDto} from "../_dto/order/orderReadDto";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private httpClient: HttpClient) {
    }

    getAllOrdersByUserId(id: number): Observable<OrderReadDto[]> {
        return this.httpClient.get<OrderReadDto[]>(AppSettings.API_ENDPOINT + "/orders/" + id);
    }

    getAllOrders(): Observable<OrderReadDto[]> {
        return this.httpClient.get<OrderReadDto[]>(AppSettings.API_ENDPOINT + "/orders");
    }

    checkout(order: OrderWriteDto): Observable<any> {
        return this.httpClient.post("http://localhost:8080/orders", order);
    }
}
