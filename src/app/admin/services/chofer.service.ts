import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IChofer } from '@data/chofer.metadata';

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  private user!:IApiUserAuthenticated;
  private baseUrl = localStorage.getItem('url-backend');
  private headers!:HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService:AuthService
  ) {
    //this.requestOptions = { headers: headers };
  }
//-----------------Visualizar operadores-------------------------------------------
  verChofer(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}chofer`,{params:params});
  }
  verChoferOperador(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}chofer/operador/`+nombre);
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlechofer(data: IChofer[]):IChofer[] {
    let chofer:IChofer[]=data;
    return chofer
  }
  verificarEmail(nombre:string)
  {
    // Inicializacion de objeto params
    let email:any={
      email: nombre,
    };
    let params = new HttpParams();
    params = params.append('email', nombre);
    this.token();
    // asignacion de parametros
    return this.http.post(`${this.baseUrl}auth/checkemail`,email,{headers:this.headers});
  }
//---------------------crear   chofer-------------------------------------------
crearChofer(data:IChofer) {
  this.token();
  return this.http.post(`${this.baseUrl}chofer`,data, {headers:this.headers})
}
handleCrearchoferError(error: any): any {
  return error=error;
}
handleCrearchofer(data: IChofer):IChofer {
  let chofer:IChofer=data;
  return chofer
}
//---------------------Editar   chofer-------------------------------------------
editarChofer(data:IChofer) {
  this.token();
  return this.http.put(`${this.baseUrl}chofer/`+data.id, data)
}
handleEditarchoferError(error: any): any {
  return error=error;
}
handleEditarchofer(data: boolean):boolean {
  let chofer:boolean=data;
  return chofer
}
//-----------------Listado de Empelados por Dependencia--------------------------------------------
private token(){
  this.user=this.authService.getUser;
    let auth_token = this.user.token;

    this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      });
}
}


