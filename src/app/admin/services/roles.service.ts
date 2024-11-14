import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IRol } from '../data/rol.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
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
  verRoles(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}roles`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlerol(data: IRol[]):IRol[] {
    let rol:IRol[]=data;
    return rol
  }
//---------------------crear   rol-------------------------------------------
crearrol(data:IRol) {
  this.token();
  return this.http.post(`${this.baseUrl}roles`,data, {headers:this.headers})
}
handleCrearrolError(error: any): any {
  return error=error;
}
handleCrearrol(data: IRol):IRol {
  let rol:IRol=data;
  return rol
}
//---------------------Editar   rol-------------------------------------------
editarrol(data:IRol) {
  this.token();
  return this.http.put(`${this.baseUrl}/roles/`+data.id, data)
}
handleEditarrolError(error: any): any {
  return error=error;
}
handleEditarrol(data: boolean):boolean {
  let rol:boolean=data;
  return rol
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


