import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IResponsableTM } from '@data/responsable_tm.metadata';

@Injectable({
  providedIn: 'root'
})
export class ResponsableTMService {
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
  verResponsableTM(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}responsabletm`,{params:params});
  }
  verResponsableTMOperador(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}responsabletm/operador/`+nombre);
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleusuario(data: IResponsableTM[]):IResponsableTM[] {
    let usuario:IResponsableTM[]=data;
    return usuario
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
//---------------------crear   usuario-------------------------------------------
crearResponsableTM(data:IResponsableTM) {
  this.token();
  return this.http.post(`${this.baseUrl}responsabletm`,data, {headers:this.headers})
}
handleCrearusuarioError(error: any): any {
  return error=error;
}
handleCrearusuario(data: IResponsableTM):IResponsableTM {
  let usuario:IResponsableTM=data;
  return usuario
}
//---------------------Editar   usuario-------------------------------------------
editarResponsableTM(data:IResponsableTM) {
  this.token();
  return this.http.put(`${this.baseUrl}responsabletm/`+data.id, data)
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


