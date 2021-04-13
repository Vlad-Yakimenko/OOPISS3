import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import { environment } from '../../environments/environment';

const currentUserItem: string = 'currentUser';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private readonly http: HttpClient,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(currentUserItem)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/sign-in`, { username, password })
      .pipe(map(res => {
        const decodedToken: Record<string, any> = jwt_decode(res.token);
        const user = {
          ...decodedToken,
          token: res.token,
        };
        localStorage.setItem(currentUserItem, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  signOut() {
    // remove user from local storage and set current user to null
    localStorage.removeItem(currentUserItem);
    this.currentUserSubject.next(null);
  }
}
