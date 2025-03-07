import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiUserAuthenticated } from '../data/iapi-auth-user.metadata';
import { IAuth } from '../data/iauth.metadata';
import { ILogin } from '../data/ilogin.metadata';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.API_URL;
  public currentUser: BehaviorSubject<any>;
  public nameUserLS: string = 'currentUser';
  private inactivityTimeout: any;
  private readonly INACTIVITY_TIME = environment.TIEMPO_AUTH * 60 * 1000; // 10 minutos
  //private readonly INACTIVITY_TIME = 30 * 1000; // 30 segundos
  constructor(
    private http: HttpClient,
    private router: Router,
    private notify: ToastrService
  ) {
    this.currentUser = new BehaviorSubject(
      JSON.parse(sessionStorage.getItem(this.nameUserLS)!)
    );
    this.startInactivityTimer();
    this.detectUserActivity();
  }

  get getUser(): IApiUserAuthenticated {
    return this.currentUser.value;
  }
/*
  login(data: ILogin): Observable<IAuth> {
    const response = { error: true, msg: 'error usuario no existe', data: null };
    return this.http.post<{ error: boolean, msg: string, data: any }>(this.baseUrl + 'auth/login', data).pipe(
      map(r => {
        response.msg = r.msg;
        response.error = r.error;
        response.data = r.data;
        this.setUserToSessionStorage(r.data);
        this.currentUser.next(r.data);
        this.resetInactivityTimer();

        if (!response.error) {
          console.log(this.currentUser.value);
          if (this.currentUser.value.operador_id == null) {
            this.router.navigateByUrl('admin/operador');
            this.notify.success('Acceso correcto bienvenido ' + this.currentUser.value.nombre_completo + '!!!', 'Bienvenido', { timeOut: 2200, positionClass: 'toast-bottom-right' });
          } else {
            this.router.navigateByUrl('public');
          }
        }
        return response;
      }),
      catchError(e => {
        this.notify.error('Email o contraseña incorrectos verifique e intente nuevamente!!!!', 'Error', { timeOut: 2000, positionClass: 'toast-bottom-right' });
        return of(response);
      })
    );
  } */

  login(data: ILogin): Observable<IAuth> {
    const response = { error: true, msg: 'Error: usuario no existe', data: null };
  
    return this.http.post<{ error: boolean; msg: string; data: any }>(this.baseUrl + 'auth/login', data).pipe(
      map(r => {
        response.msg = r.msg;
        response.error = r.error;
        response.data = r.data;
        
        this.setUserToSessionStorage(r.data);
        this.currentUser.next(r.data);
        this.resetInactivityTimer();
  
        if (!response.error) {
          console.log(this.currentUser.value);
  
          // 🔴 Verificar si la contraseña ingresada es la predeterminada
          if (data.password === '12345678') {
            localStorage.setItem('mustChangePassword', 'true');
            this.router.navigateByUrl('auth/cambiar-password');
            this.notify.warning('Debes cambiar tu contraseña antes de continuar.', 'Cambio requerido', { timeOut: 2500, positionClass: 'toast-bottom-right' });
            return response;
          } else {
            localStorage.removeItem('mustChangePassword'); // Eliminar flag si ya cambió su contraseña
          }
  
          // 🔹 Redirección según condición
          if (this.currentUser.value.operador_id == null) {
            this.router.navigateByUrl('admin');
            this.notify.success('Acceso correcto, bienvenido ' + this.currentUser.value.nombre_completo + '!!!', 'Bienvenido', { timeOut: 2200, positionClass: 'toast-bottom-right' });
          } else {
            this.router.navigateByUrl('public');
          }
        }
  
        return response;
      }),
      catchError(e => {
        this.notify.error('Email o contraseña incorrectos, verifique e intente nuevamente!!!!', 'Error', { timeOut: 2000, positionClass: 'toast-bottom-right' });
        return of(response);
      })
    );
  }
  



  public logout() {
    if (sessionStorage.getItem(this.nameUserLS) != null) {
      sessionStorage.removeItem(this.nameUserLS);
      this.currentUser.next(null);
      clearTimeout(this.inactivityTimeout);
      this.router.navigateByUrl('auth');
    }
  }

  private setUserToSessionStorage(user: IApiUserAuthenticated) {
    sessionStorage.setItem(this.nameUserLS, JSON.stringify(user));
  }

  private startInactivityTimer() {
    this.inactivityTimeout = setTimeout(() => {
      this.logout();
      this.notify.warning('Sesión cerrada por inactividad.', 'Atención', { timeOut: 2000, positionClass: 'toast-bottom-right' });
    }, this.INACTIVITY_TIME);
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    this.startInactivityTimer();
  }

  private detectUserActivity() {
    document.addEventListener('mousemove', () => this.resetInactivityTimer());
    document.addEventListener('keydown', () => this.resetInactivityTimer());
    document.addEventListener('click', () => this.resetInactivityTimer());
  }
}
