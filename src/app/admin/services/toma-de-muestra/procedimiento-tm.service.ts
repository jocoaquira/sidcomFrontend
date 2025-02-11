import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IProcedimiento } from '@data/procedimiento_tm.metadata';

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
//-----------------Visualizar Procedimiento-------------------------------------------
  verProcedimientos()
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}procedimiento`);
  }

  handleError(error: any): any {
    return error=error.error.error;
  }
  handleProcedimientos(data: IProcedimiento[]):IProcedimiento[] {
    let Procedimiento:IProcedimiento[]=data;
    return Procedimiento
  }
  //-----------------Visualizar Procedimiento-------------------------------------------
  verProcedimiento(nombre:string)
  {
    return this.http.get(`${this.baseUrl}procedimiento/`+nombre);
  }
  handleProcedimiento(data: IProcedimiento):IProcedimiento {
    let Procedimiento:IProcedimiento=data;
    return Procedimiento
  }
//---------------------crear   Procedimiento-------------------------------------------
crearProcedimientoTM(data:IProcedimiento) {
  this.token();
  return this.http.post(`${this.baseUrl}procedimiento`,data, {headers:this.headers})
}
handleCrearProcedimientoError(error: any): any {
  return error=error;
}
handleCrearProcedimiento(data: IProcedimiento):IProcedimiento {
  let Procedimiento:IProcedimiento=data;
  return Procedimiento
}
//---------------------Editar   Procedimiento-------------------------------------------
editarProcedimientoTM(data:IProcedimiento) {
  this.token();
  let id=data.id;
  //delete data.id; 
  console.log(data);
  return this.http.put(`${this.baseUrl}procedimiento/`+data.id, data)
}
handleEditarProcedimientoError(error: any): any {
  return error=error;
}
handleEditarProcedimiento(data: boolean):boolean {
  let Procedimiento:boolean=data;
  return Procedimiento
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


