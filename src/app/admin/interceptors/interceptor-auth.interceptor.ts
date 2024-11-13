import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { AuthService } from '@core/authentication/services/auth.service';

@Injectable()
export class InterceptorAuthInterceptor implements HttpInterceptor {
  private user!:IApiUserAuthenticated;
  constructor(
    private authService:AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.user=this.authService.getUser;
    if(this.user!==null)
    {
      let auth_token = this.user.token;
      if(auth_token){
        request=request.clone(
          {
            setHeaders:{
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth_token}`
            }
          }
        );
      }
    }

      return next.handle(request).pipe(
        catchError((err:any)=>{
          if(err instanceof HttpErrorResponse){
            if(err.status===401)
            {
            }
          }
          return throwError(err);
        })
      )

  }
}
