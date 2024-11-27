import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IPresentacion } from '@data/presentacion.metadata';

@Injectable({
  providedIn: 'root'
})
export class PresentacionService {
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
  verpresentacions(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('id', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}presentacion`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlepresentacion(data: IPresentacion[]):IPresentacion[] {
    let presentacion:IPresentacion[]=data;
    return presentacion
  }
//---------------------crear   presentacion-------------------------------------------
crearpresentacion(data:IPresentacion) {
  this.token();
  return this.http.post(`${this.baseUrl}/presentacion`,data, {headers:this.headers})
}
handleCrearpresentacionError(error: any): any {
  return error=error;
}
handleCrearpresentacion(data: IPresentacion):IPresentacion {
  let presentacion:IPresentacion=data;
  return presentacion
}
//---------------------Editar   presentacion-------------------------------------------
editarpresentacion(data:IPresentacion) {
  this.token();
  return this.http.put(`${this.baseUrl}/presentacion/`+data.id, data)
}
handleEditarpresentacionError(error: any): any {
  return error=error;
}
handleEditarpresentacion(data: boolean):boolean {
  let presentacion:boolean=data;
  return presentacion
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


