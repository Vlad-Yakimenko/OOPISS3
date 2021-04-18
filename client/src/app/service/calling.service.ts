import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Calling } from '../shared/interface';
import { AuthenticationService } from './authentication.service';

interface GetCallingsResponse {
  incomingCallings: Calling[];
  outgoingCallings: Calling[];
}

@Injectable({ providedIn: 'root' })
export class CallingService {
  constructor(
    private readonly http: HttpClient,
  ) { }

  public getCallings(userId: number): Observable<GetCallingsResponse> {
    return this.http.get<GetCallingsResponse>(`${environment.apiUrl}/calling?userId=${userId}`);
  }

  public addCallings(userId: number, callings: Calling[]): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${environment.apiUrl}/calling`, { userId, callings });
  }
}
