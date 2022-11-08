import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {




      console.log('hello');

      req = req.clone(
        {
          setHeaders: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
          }
        }
      )
    return next.handle(req);

  }

}
