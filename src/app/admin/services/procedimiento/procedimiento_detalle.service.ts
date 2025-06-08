import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IProcedimientoDetalle } from '@data/procedimiento_detalle.metadata';


@Injectable({
  providedIn: 'root'
})
export class ProcedimientoDetalleService {
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
  verProcedimientoDetallees(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}procedimiento`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleProcedimientoDetalle(data: IProcedimientoDetalle[]):IProcedimientoDetalle[] {
    let ProcedimientoDetalle:IProcedimientoDetalle[]=data;
    return ProcedimientoDetalle
  }
  //-----------------------------Ver Pais---------------------------------
  verPais(nombre:string)
{
  return this.http.get(`${this.baseUrl}procedimiento/`+nombre);
}
//---------------------crear   ProcedimientoDetalle-------------------------------------------
crearProcedimientoDetalle(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}procedimiento`,data, {headers:this.headers})
}
handleCrearProcedimientoDetalleError(error: any): any {
  return error=error;
}
handleCrearProcedimientoDetalle(data: IProcedimientoDetalle):IProcedimientoDetalle {
  let ProcedimientoDetalle:IProcedimientoDetalle=data;
  return ProcedimientoDetalle
}
//---------------------Editar   ProcedimientoDetalle-------------------------------------------
editarProcedimientoDetalle(data:IProcedimientoDetalle) {
  this.token();
  return this.http.put(`${this.baseUrl}procedimiento/`+data.id, data)
}
handleEditarProcedimientoDetalleError(error: any): any {
  return error=error;
}
handleEditarProcedimientoDetalle(data: boolean):boolean {
  let ProcedimientoDetalle:boolean=data;
  return ProcedimientoDetalle
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


