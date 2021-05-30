import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler,
  HttpEvent, HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  first, map, mergeMap, tap
} from 'rxjs/operators';

import { AuthService } from '../service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    return this.authService.isAuthenticated$.pipe(
      first(),
      mergeMap((isAuthenticated) => {
        if (isAuthenticated && this.authService.accessToken) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${this.authService.accessToken}`
            }
          });
        }
        return next.handle(request);
      })
    );
  }
}
