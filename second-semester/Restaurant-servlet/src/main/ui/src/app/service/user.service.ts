import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { tap } from 'rxjs/operators';

import { User } from "../shared/dto/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
  ) { }

  getAll() {
    return this.http.get<User[]>(`http://localhost:8080/users`);
  }

  register(user: User) {
    return this.http.post(`http://localhost:8080/users/users/register`, user);
  }

  getUserInfo(username: string): Observable<User> {
    return this.http.get<User>(`http://localhost:8080/restaurant/users/${username}`).pipe(
      tap((res) => console.log(res)),
    );
  }

  delete(id: number) {
    return this.http.delete(`http://localhost:8080/users/${id}`);
  }

  changeBalance(username: string, newBalance: number): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/restaurant/users/${username}?balance=${newBalance}`, {}).pipe(
      tap((res) => console.log(res)),
    )
  }
}
