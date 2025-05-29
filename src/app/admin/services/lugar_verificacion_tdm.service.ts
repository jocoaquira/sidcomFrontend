import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { ILugarVerificacionTDM } from '@data/lugar_verificacion_tdm.metadata';

@Injectable({
  providedIn: 'root'
})
export class LugarVerificacionTDMService {
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
  verlugarverificacionTDMs(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}lugarverificaciontdm`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlelugarverificacion(data: ILugarVerificacionTDM[]):ILugarVerificacionTDM[] {
    let lugarverificacion:ILugarVerificacionTDM[]=data;
    return lugarverificacion
  }
  //-----------------------------Ver LugarVerificacionTDM---------------------------------
  verLugarVerificacionTDM(nombre:string)
{
  return this.http.get(`${this.baseUrl}lugarverificaciontdm/`+nombre);
}
//---------------------crear   lugarverificacion-------------------------------------------
crearlugarverificacionTDM(data:ILugarVerificacionTDM) {
  this.token();
  return this.http.post(`${this.baseUrl}/lugarverificaciontdm`,data, {headers:this.headers})
}
handleCrearlugarverificacionError(error: any): any {
  return error=error;
}
handleCrearlugarverificacionTDM(data: ILugarVerificacionTDM):ILugarVerificacionTDM {
  let lugarverificacion:ILugarVerificacionTDM=data;
  return lugarverificacion
}
//---------------------Editar   lugarverificacion-------------------------------------------
editarlugarverificacionTDM(data:ILugarVerificacionTDM) {
  this.token();
  return this.http.put(`${this.baseUrl}/lugarverificaciontdm`+data.id, data)
}
handleEditarlugarverificacionTDMError(error: any): any {
  return error=error;
}
handleEditarlugarverificacionTDM(data: boolean):boolean {
  let lugarverificacion:boolean=data;
  return lugarverificacion
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


