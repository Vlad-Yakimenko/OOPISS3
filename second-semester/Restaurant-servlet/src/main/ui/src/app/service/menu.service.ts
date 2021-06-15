import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DishReadWriteDto } from '../shared/dto/dish';

@Injectable({ providedIn: 'root' })
export class MenuService {
  url = 'http://localhost:8080/dishes';

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAllDishes(): Observable<DishReadWriteDto[]> {
    return this.httpClient.get<DishReadWriteDto[]>('http://localhost:8080/restaurant/dishes');
  }
}
