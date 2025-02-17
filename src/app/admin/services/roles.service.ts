import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IRol } from '../data/rol.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IPermisoRol } from '@data/permisos-por-rol.metadata';

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
  verRoles()
  {


    // asignacion de parametros
    return this.http.get(`${this.baseUrl}roles`);
  }
   handleError(error: any): any {
    return error=error.error.error;
  }
  handlerol(data: IPermisoRol[]):IPermisoRol[] {
    let rol:IPermisoRol[]=data;
    return rol
  }
//-----------------Ver de Roles-------------------------------------------
  verRole(data:any)
  {
    return this.http.get(`${this.baseUrl}roles/`+data);
  }
  handleErrorRole(error: any): any {
    return error=error.error.error;
  }
  handleRole(data: IPermisoRol):IPermisoRol {
    let empleado:IPermisoRol=data;
    return empleado
  }
//---------------------crear   rol-------------------------------------------
crearrol(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}roles`,data, {headers:this.headers})
}
handleCrearrolError(error: any): any {
  return error=error;
}
handleCrearrol(data: IPermisoRol):IPermisoRol {
  let rol:IPermisoRol=data;
  return rol
}
//---------------------Editar   rol-------------------------------------------
editarrol(data:any) {
  this.token();
  return this.http.put(`${this.baseUrl}roles/`+data.id, data)
}
handleEditarrolError(error: any): any {
  return error=error;
}
handleEditarrol(data: boolean):boolean {
  let rol:boolean=data;
  return rol
}
//---------------------Eliminar Role-------------------------------------------
eliminarRole(id:any) {
  return this.http.delete(`${this.baseUrl}roles/`+id)
}
handleEliminarRoleError(error: any): any {
  return error=error;
}
handleEliminarRole(data: boolean):boolean {
  let Role:boolean=data;
  return Role
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


