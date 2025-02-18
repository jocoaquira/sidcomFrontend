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
    this.user = this.authService.getUser;

    if (this.user !== null) {
        let auth_token = this.user.token;

        if (auth_token) {
            // Verificar si el cuerpo de la solicitud es FormData
            const isFormData = request.body instanceof FormData;

            // Clonar la solicitud sin 'Content-Type' si es FormData
            request = request.clone({
                setHeaders: isFormData
                    ? { 'Authorization': `Bearer ${auth_token}` } // No agrega Content-Type
                    : { 
                        //'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${auth_token}` 
                    }
            });
        }
    }

    return next.handle(request).pipe(
        catchError((err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    // Aquí podrías redirigir a login o manejar la autenticación
                }
            }
            return throwError(() => err);
        })
    );
  }

}
