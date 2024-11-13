import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
//import { SnotifyService } from 'ng-snotify';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiUserAuthenticated } from '../data/iapi-auth-user.metadata';
import { IAuth } from '../data/iauth.metadata';
import { ILogin } from '../data/ilogin.metadata';
@Injectable({
  providedIn:'root'
})
export class AuthService {
  private baseUrl = environment.API_URL+'api/';
public currentUser:BehaviorSubject<any>;
public nameUserLS:string='currentUser';

  constructor(
    private http:HttpClient,
    private router:Router,
    private notify:ToastrService
    ) {
        this.currentUser= new BehaviorSubject(
          JSON.parse(sessionStorage.getItem(this.nameUserLS)!)
        );
     }
  get getUser(): IApiUserAuthenticated{

    return this.currentUser.value;
  }
  login(data:ILogin): Observable <IAuth>{
    const response ={error:true,msg:'error usuario no existe',data:null};
    return this.http.post<{error:boolean,msg:string,data:any}>(this.baseUrl+'login',data).pipe(
      map( r => {
        response.msg=r.msg;
        response.error=r.error;
        response.data=r.data;
        this.setUserToSessionStorage(r.data);
        this.currentUser.next(r.data);
        if(!response.error){
            console.log('correcto');
          this.router.navigateByUrl('admin/operador');
          this.notify.success('Acceso correcto bienvenido '+this.currentUser.value.nombre_completo+'!!!','Bienvenido',{timeOut:2200,positionClass: 'toast-bottom-right'});
          }
        return response;
      }),
      catchError(
        e => {
            this.notify.error('Email o contraseña incorrectos verifique e intente nuevamente!!!!','Error',{timeOut:2000,positionClass: 'toast-bottom-right'});
          return of(response);
        }
      )
    )
  }

  public logout(){
    if(sessionStorage.getItem(this.nameUserLS)!=null)
    {
      sessionStorage.removeItem(this.nameUserLS);
      this.currentUser.next(null);
      this.router.navigateByUrl('auth');
    }

  }
  private setUserToLocalStorage(user:IApiUserAuthenticated){
    localStorage.setItem(this.nameUserLS,JSON.stringify(user));
  }
  private setUserToSessionStorage(user:IApiUserAuthenticated)
  {
    sessionStorage.setItem(this.nameUserLS, JSON.stringify(user));
  }

}
