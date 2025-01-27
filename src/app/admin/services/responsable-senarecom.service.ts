import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IResponsableSenarecom } from '@data/responsable_senarecom_tm.metadata';


@Injectable({
  providedIn: 'root'
})
export class ResponsableSenarecomService {
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
  verResponsableSenarecom(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}senarecomtm`,{params:params});
  }

  handleError(error: any): any {
    return error=error.error.error;
  }
  handleusuario(data: IResponsableSenarecom[]):IResponsableSenarecom[] {
    let usuario:IResponsableSenarecom[]=data;
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
crearResponsableSenarecom(data:IResponsableSenarecom) {
  this.token();
  return this.http.post(`${this.baseUrl}senarecomtm`,data, {headers:this.headers})
}
handleCrearusuarioError(error: any): any {
  return error=error;
}
handleCrearusuario(data: IResponsableSenarecom):IResponsableSenarecom {
  let usuario:IResponsableSenarecom=data;
  return usuario
}
//---------------------Editar   usuario-------------------------------------------
editarResponsableSenarecom(data:IResponsableSenarecom) {
  this.token();
  return this.http.put(`${this.baseUrl}senarecomtm/`+data.id, data)
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


