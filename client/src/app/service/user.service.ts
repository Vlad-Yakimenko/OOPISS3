import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Abonent } from '../shared/interface/abonent.interface';

@Injectable({ providedIn: 'root' })
export class UserService { 
  constructor(
    private readonly http: HttpClient,
  ) { }

  public getAbonents(): Observable<Abonent[]> {
    return this.http.get<{ abonents: Abonent[] }>(`${environment.apiUrl}/user`)
      .pipe(map(res => res.abonents));
  }

  public changeUserStatus(userId: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${environment.apiUrl}/user/change-status`, { userId });
  }

  public changeUserBalance(userId: number, newBalance: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${environment.apiUrl}/user/change-balance`, { userId, newBalance });
  }
}