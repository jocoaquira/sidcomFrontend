import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioExternoMunicipioOrigen } from '@data/form_ext_municipio_origen.metadata';

@Injectable({
  providedIn: 'root'
})
export class FormularioExternoMunicipioOrigenService {
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
  verFormularioExternoMunicipioOrigen(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('formulario_int_id', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}form-int-municipio-origen`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioExternoMunicipioOrigen(data: IFormularioExternoMunicipioOrigen[]):IFormularioExternoMunicipioOrigen[] {
    let FormularioExternoMunicipioOrigen:IFormularioExternoMunicipioOrigen[]=data;
    return FormularioExternoMunicipioOrigen
  }



//---------------------crear   FormularioExternoMunicipioOrigen-------------------------------------------
crearFormularioExternoMunicipioOrigen(data:IFormularioExternoMunicipioOrigen) {
  this.token();
  return this.http.post(`${this.baseUrl}form-int-municipio-origen`,data, {headers:this.headers})
}
handleCrearFormularioExternoMunicipioOrigenError(error: any): any {
  return error=error;
}
handleCrearFormularioExternoMunicipioOrigen(data: IFormularioExternoMunicipioOrigen):IFormularioExternoMunicipioOrigen {
  let FormularioExternoMunicipioOrigen:IFormularioExternoMunicipioOrigen=data;
  return FormularioExternoMunicipioOrigen
}
//---------------------Editar   FormularioExternoMunicipioOrigen-------------------------------------------
editarFormularioExternoMunicipioOrigen(data:IFormularioExternoMunicipioOrigen) {
  this.token();
  return this.http.put(`${this.baseUrl}form-int-municipio-origen/`+data.id, data)
}
handleEditarFormularioExternoMunicipioOrigenError(error: any): any {
  return error=error;
}
handleEditarFormularioExternoMunicipioOrigen(data: boolean):boolean {
  let FormularioExternoMunicipioOrigen:boolean=data;
  return FormularioExternoMunicipioOrigen
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


