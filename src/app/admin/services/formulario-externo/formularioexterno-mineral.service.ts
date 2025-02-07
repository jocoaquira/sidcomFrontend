import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioExternoMineral } from '@data/form_ext_mineral.metadata';

@Injectable({
  providedIn: 'root'
})
export class FormularioExternoMineralService {
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
  verFormularioExternoMineral(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('formulario_int_id', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formulario-interno-minerales`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioExternoMineral(data: IFormularioExternoMineral[]):IFormularioExternoMineral[] {
    let FormularioExternoMineral:IFormularioExternoMineral[]=data;
    return FormularioExternoMineral
  }



//---------------------crear   FormularioExternoMineral-------------------------------------------
crearFormularioExternoMineral(data:IFormularioExternoMineral) {
  this.token();
  return this.http.post(`${this.baseUrl}formulario-interno-minerales`,data, {headers:this.headers})
}
handleCrearFormularioExternoMineralError(error: any): any {
  return error=error;
}
handleCrearFormularioExternoMineral(data: IFormularioExternoMineral):IFormularioExternoMineral {
  let FormularioExternoMineral:IFormularioExternoMineral=data;
  return FormularioExternoMineral
}
//---------------------Editar   FormularioExternoMineral-------------------------------------------
editarFormularioExternoMineral(data:IFormularioExternoMineral) {
  this.token();
  return this.http.put(`${this.baseUrl}formulario-interno-minerales/`+data.id, data)
}
handleEditarFormularioExternoMineralError(error: any): any {
  return error=error;
}
handleEditarFormularioExternoMineral(data: boolean):boolean {
  let FormularioExternoMineral:boolean=data;
  return FormularioExternoMineral
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


