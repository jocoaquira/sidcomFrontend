import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { IFormularioInterno } from '@data/formulario_interno.metadata';

@Injectable({
  providedIn: 'root'
})
export class FormularioInternosService {
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
  verFormularioInternos(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioInterno(data: IFormularioInterno[]):IFormularioInterno[] {
    let FormularioInterno:IFormularioInterno[]=data;
    return FormularioInterno
  }
//-----------------Visualizar Formulario Interno-------------------------------------------
verFormularioInterno(nombre:string)
{
  // Inicializacion de objeto params
  let params = new HttpParams();
  params = params.append('id', nombre);

  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formint`,{params:params});
}
  //-----------------Visualizar operadores-------------------------------------------
  verFormularioInternosSimple(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint/lista-simple`,{params:params});
  }
  handleFormularioInternoSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioInternoSimple(data: IFormularioInternoSimple[]):IFormularioInternoSimple[] {
    let FormularioInterno:IFormularioInternoSimple[]=data;
    return FormularioInterno
  }


//---------------------crear   FormularioInterno-------------------------------------------
crearFormularioInterno(data:any) {
  this.token();
  console.log(data);
  return this.http.post(`${this.baseUrl}formint`,data, {headers:this.headers})
}
handleCrearFormularioInternoError(error: any): any {
  return error=error;
}
handleCrearFormularioInterno(data: any):any {
  let FormularioInterno:any=data;
  return FormularioInterno
}
//---------------------Editar   FormularioInterno-------------------------------------------
editarFormularioInterno(data:IFormularioInterno) {
  this.token();
  return this.http.put(`${this.baseUrl}formint/`+data.id, data)
}
handleEditarFormularioInternoError(error: any): any {
  return error=error;
}
handleEditarFormularioInterno(data: boolean):boolean {
  let FormularioInterno:boolean=data;
  return FormularioInterno
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


