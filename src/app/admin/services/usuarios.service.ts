import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IUsuario } from '../data/usuario.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
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
  verusuarios(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}usuarios`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleusuario(data: IUsuario[]):IUsuario[] {
    let usuario:IUsuario[]=data;
    return usuario
  }
//---------------------crear   usuario-------------------------------------------
crearusuario(data:IUsuario) {
  this.token();
  return this.http.post(`${this.baseUrl}/usuarios`,data, {headers:this.headers})
}
handleCrearusuarioError(error: any): any {
  return error=error;
}
handleCrearusuario(data: IUsuario):IUsuario {
  let usuario:IUsuario=data;
  return usuario
}
//---------------------Editar   usuario-------------------------------------------
editarusuario(data:IUsuario) {
  this.token();
  return this.http.put(`${this.baseUrl}/usuarios/`+data.id, data)
}
handleEditarusuarioError(error: any): any {
  return error=error;
}
handleEditarusuario(data: boolean):boolean {
  let usuario:boolean=data;
  return usuario
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


