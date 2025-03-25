import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioInternoMunicipioOrigen } from '@data/form_int_municipio_origen.metadata';

@Injectable({
  providedIn: 'root'
})
export class FormularioTrasladoColaMunicipioOrigenService {
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
  verFormularioInternoMunicipioOrigen(nombre:string)
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
  handleFormularioInternoMunicipioOrigen(data: IFormularioInternoMunicipioOrigen[]):IFormularioInternoMunicipioOrigen[] {
    let FormularioInternoMunicipioOrigen:IFormularioInternoMunicipioOrigen[]=data;
    return FormularioInternoMunicipioOrigen
  }



//---------------------crear   FormularioInternoMunicipioOrigen-------------------------------------------
crearFormularioInternoMunicipioOrigen(data:IFormularioInternoMunicipioOrigen) {
  this.token();
  return this.http.post(`${this.baseUrl}form-int-municipio-origen`,data, {headers:this.headers})
}
handleCrearFormularioInternoMunicipioOrigenError(error: any): any {
  return error=error;
}
handleCrearFormularioInternoMunicipioOrigen(data: IFormularioInternoMunicipioOrigen):IFormularioInternoMunicipioOrigen {
  let FormularioInternoMunicipioOrigen:IFormularioInternoMunicipioOrigen=data;
  return FormularioInternoMunicipioOrigen
}
//---------------------Editar   FormularioInternoMunicipioOrigen-------------------------------------------
editarFormularioInternoMunicipioOrigen(data:IFormularioInternoMunicipioOrigen) {
  this.token();
  return this.http.put(`${this.baseUrl}form-int-municipio-origen/`+data.id, data)
}
handleEditarFormularioInternoMunicipioOrigenError(error: any): any {
  return error=error;
}
handleEditarFormularioInternoMunicipioOrigen(data: boolean):boolean {
  let FormularioInternoMunicipioOrigen:boolean=data;
  return FormularioInternoMunicipioOrigen
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


