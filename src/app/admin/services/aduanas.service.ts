import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IAduana } from '@data/aduana.metadata';

@Injectable({
  providedIn: 'root'
})
export class AduanasService {
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
  veraduanas(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}aduana`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleaduana(data: IAduana[]):IAduana[] {
    let aduana:IAduana[]=data;
    return aduana
  }
  //-----------------------------Ver Aduana---------------------------------
  verAduana(nombre:string)
{
  return this.http.get(`${this.baseUrl}aduana/`+nombre);
}
//---------------------crear   aduana-------------------------------------------
crearaduana(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}aduana`,data, {headers:this.headers})
}
handleCrearaduanaError(error: any): any {
  return error=error;
}
handleCrearaduana(data: IAduana):IAduana {
  let aduana:IAduana=data;
  return aduana
}
//---------------------Editar   aduana-------------------------------------------
editaraduana(data:IAduana) {
  this.token();
  return this.http.put(`${this.baseUrl}aduana/`+data.id, data)
}
handleEditaraduanaError(error: any): any {
  return error=error;
}
handleEditaraduana(data: boolean):boolean {
  let aduana:boolean=data;
  return aduana
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


