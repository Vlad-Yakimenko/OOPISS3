import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  User, Tariff
} from '../shared/interface';

@Injectable({ providedIn: 'root' })
export class TariffService {
  constructor(
    private readonly http: HttpClient,
  ) { }

  public getTariffs(userId?: number): Observable<Tariff[]> {
    let url: string = `${environment.apiUrl}/tariff`;

    if (userId) {
      url = `${url}?userId=${userId}`;
    }

    return this.http.get<{ tariffs: Tariff[] }>(url)
      .pipe(map(res => res.tariffs));
  }

}