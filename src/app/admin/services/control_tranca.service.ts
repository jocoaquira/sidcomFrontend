import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IControlTranca } from '@data/control_tranca.metadata';

@Injectable({
  providedIn: 'root'
})
export class ControlTrancaService {
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
  verControlTrancas(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}control-tranca`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleListarControlTrancas(data: IControlTranca[]):IControlTranca[] {
    let ControlTranca:IControlTranca[]=data;
    return ControlTranca
  }

  //-----------------------------Ver ControlTranca---------------------------------
  verControlTranca(nombre:string)
{
  return this.http.get(`${this.baseUrl}control-tranca/`+nombre);
}
//---------------------crear   ControlTranca-------------------------------------------
crearControlTranca(data:IControlTranca) {
  this.token();
  return this.http.post(`${this.baseUrl}control-tranca`,data, {headers:this.headers})
}
handleCrearControlTrancaError(error: any): any {
  return error=error;
}
handleCrearControlTranca(data: IControlTranca):IControlTranca {
  let ControlTranca:IControlTranca=data;
  return ControlTranca
}
//---------------------Editar   ControlTranca-------------------------------------------
editarControlTranca(data:IControlTranca) {
  this.token();
  return this.http.put(`${this.baseUrl}control-tranca/`+data.id, data)
}
handleEditarControlTrancaError(error: any): any {
  return error=error;
}
handleEditarControlTranca(data: boolean):boolean {
  let ControlTranca:boolean=data;
  return ControlTranca
}
//---------------------Eliminar   ControlTranca-------------------------------------------
eliminarControlTranca(data:number) {
    this.token();
    return this.http.delete(`${this.baseUrl}control-tranca/`+data)
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


