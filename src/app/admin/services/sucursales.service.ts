import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ISucursal } from '../data/sucursal.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';

@Injectable({
  providedIn: 'root'
})
export class SucursalsService {
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
  verSucursales(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}sucursal`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlesucursal(data: ISucursal[]):ISucursal[] {
    let sucursal:ISucursal[]=data;
    return sucursal
  }

//---------------------crear   sucursal-------------------------------------------
crearSucursal(data:ISucursal) {
  this.token();
  return this.http.post(`${this.baseUrl}sucursal`,data, {headers:this.headers})
}
handleCrearsucursalError(error: any): any {
  return error=error;
}
handleCrearsucursal(data: ISucursal):ISucursal {
  let sucursal:ISucursal=data;
  return sucursal
}
//---------------------Editar   sucursal-------------------------------------------
editarSucursal(data:ISucursal) {
  this.token();
  return this.http.put(`${this.baseUrl}sucursal/`+data.id, data)
}
handleEditarsucursalError(error: any): any {
  return error=error;
}
handleEditarsucursal(data: boolean):boolean {
  let sucursal:boolean=data;
  return sucursal
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

