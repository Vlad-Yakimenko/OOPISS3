import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  User, Tariff
} from '../shared/interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private readonly http: HttpClient,
  ) { }

  public getAbonents(): Observable<User[]> {
    return this.http.get<{ abonents: User[] }>(`${environment.apiUrl}/user?onlyAbonents=true`)
      .pipe(map(res => res.abonents));
  }

  public getUserById(userId: number): Observable<User> {
    return this.http.get<{ user: User }>(`${environment.apiUrl}/user?userId=${userId}`)
      .pipe(map(res => res.user));
  }

  public getUserByPhone(phone: string): Observable<User> {
    return this.http.get<{ user: User }>(`${environment.apiUrl}/user?phone=${phone}`)
      .pipe(map(res => res.user));
  }

  public changeUserStatus(userId: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${environment.apiUrl}/user/change-status`, { userId });
  }

  public changeUserBalance(userId: number, newBalance: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${environment.apiUrl}/user/change-balance`, { userId, newBalance });
  }

  public addTariffs(userId: number, tariffs: Tariff[]): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${environment.apiUrl}/user/add-tariffs`, { userId, tariffs });
  }
}