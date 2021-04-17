import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import jwt_decode from "jwt-decode";

import { environment } from '../../environments/environment';
import { CurrentUser } from '../shared/interface';
import { UserService } from './user.service';

const currentUserItem: string = 'currentUser';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<CurrentUser>;
  public currentUser: Observable<CurrentUser>;

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
  ) {
    this.currentUserSubject = new BehaviorSubject<CurrentUser>(
      JSON.parse(localStorage.getItem(currentUserItem))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getCurrentUserBalance(): Observable<number> {
    const userId = this.currentUserValue?.userId;
    return this.userService.getUserById(userId).pipe(
      map(user => user.bill.balance),
    );
  }

  public get currentUserValue(): CurrentUser {
    return this.currentUserSubject.value;
  }

  public register(user: CurrentUser): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/sign-up`, user)
      .pipe(tap(res => console.log(res)));
  }

  public login(username: string, password: string): Observable<CurrentUser> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/sign-in`, { username, password })
      .pipe(map(res => {
        const decodedToken: Record<string, any> = jwt_decode(res.token);
        const user = {
          ...decodedToken,
          token: res.token,
        } as CurrentUser;
        localStorage.setItem(currentUserItem, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  public logOut(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem(currentUserItem);
    this.currentUserSubject.next(null);
  }
}
