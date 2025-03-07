import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioInternoMineral } from '@data/form_int_mineral.metadata';

@Injectable({
  providedIn: 'root'
})
export class FormularioInternoMineralService {
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
  verFormularioInternoMineral(nombre:string)
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
  handleFormularioInternoMineral(data: IFormularioInternoMineral[]):IFormularioInternoMineral[] {
    let FormularioInternoMineral:IFormularioInternoMineral[]=data;
    return FormularioInternoMineral
  }



//---------------------crear   FormularioInternoMineral-------------------------------------------
crearFormularioInternoMineral(data:IFormularioInternoMineral) {
  this.token();
  return this.http.post(`${this.baseUrl}formulario-interno-minerales`,data, {headers:this.headers})
}
handleCrearFormularioInternoMineralError(error: any): any {
  return error=error;
}
handleCrearFormularioInternoMineral(data: IFormularioInternoMineral):IFormularioInternoMineral {
  let FormularioInternoMineral:IFormularioInternoMineral=data;
  return FormularioInternoMineral
}
//---------------------Editar   FormularioInternoMineral-------------------------------------------
editarFormularioInternoMineral(data:IFormularioInternoMineral) {
  this.token();
  return this.http.put(`${this.baseUrl}formulario-interno-minerales/`+data.id, data)
}
handleEditarFormularioInternoMineralError(error: any): any {
  return error=error;
}
handleEditarFormularioInternoMineral(data: boolean):boolean {
  let FormularioInternoMineral:boolean=data;
  return FormularioInternoMineral
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


