

// see https://github.com/codingforentrepreneurs/Django-Angular-Ionic/blob/master/client/dj-ion/src/app/auth/token.interceptor.ts
// https://github.com/angular/angular/issues/18224
// https://github.com/auth0/angular2-jwt/issues/494

/*
import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/do';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private isUpdating = false;
    private offsetSeconds = 3600;
    private subscriptions = new Array<Subscription>();

    constructor(
        private injector: Injector,
    ) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
          console.log('INTERCEPTED, but not doing anything');
        return next.handle(request).do(
            (event: HttpEvent<any>) => {
            },
            (error: any) => {
            }
        );
    }

}
*/
