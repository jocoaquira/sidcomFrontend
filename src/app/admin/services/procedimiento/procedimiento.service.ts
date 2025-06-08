import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IProcedimiento } from '@data/procedimiento.metadata';


@Injectable({
  providedIn: 'root'
})
export class ProcedimientoService {
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
  verProcedimientos()
  {
   // asignacion de parametros
    return this.http.get(`${this.baseUrl}procedimientoTM`);
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleprocedimiento(data: IProcedimiento[]):IProcedimiento[] {
    let procedimiento:IProcedimiento[]=data;
    return procedimiento
  }
  //-----------------------------Ver Procedimiento---------------------------------
  verProcedimiento(nombre:string)
{
  return this.http.get(`${this.baseUrl}procedimientoTM/`+nombre);
}
//---------------------crear   procedimiento-------------------------------------------
crearProcedimiento(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}procedimientoTM`,data, {headers:this.headers})
}
handleCrearProcedimientoError(error: any): any {
  return error=error;
}
handleCrearProcedimiento(data: IProcedimiento):IProcedimiento {
  let procedimiento:IProcedimiento=data;
  return procedimiento
}
//---------------------Editar   procedimiento-------------------------------------------
editarProcedimiento(data:IProcedimiento) {
  this.token();
  return this.http.put(`${this.baseUrl}procedimientoTM/`+data.id, data)
}
handleEditarprocedimientoError(error: any): any {
  return error=error;
}
handleEditarProcedimiento(data: boolean):boolean {
  let procedimiento:boolean=data;
  return procedimiento
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


