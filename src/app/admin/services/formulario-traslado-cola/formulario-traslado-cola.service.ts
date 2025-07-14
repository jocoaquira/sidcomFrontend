import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioTrasladoColaSimple } from '@data/formulario_cola_simple.metadata';
import { IFormularioTrasladoCola } from '@data/formulario_cola.metadata';
import { IFormularioTrasladoColaPDF } from '@data/formulario_cola_pdf.metadata';


@Injectable({
  providedIn: 'root'
})
export class FormularioTrasladoColaService {
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
  verFormularioTrasladoColas(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formcola`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioTrasladoCola(data: IFormularioTrasladoCola[]):IFormularioTrasladoCola[] {
    let FormularioTrasladoCola:IFormularioTrasladoCola[]=data;
    return FormularioTrasladoCola
  }
//-----------------Visualizar Formulario Interno-------------------------------------------
verFormularioTrasladoCola(nombre:string)
{
  // Inicializacion de objeto params
  let params = new HttpParams();
  params = params.append('id', nombre);

  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formcola/`+nombre,{params:params});
}
//-----------------Visualizar Toma de Muestra-------------------------------------------
verFormularioTrasladoColaPDF(nombre:string)
{
  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formcola/print/`+nombre);
}
handleFormularioTrasladoColaPDF(data: IFormularioTrasladoColaPDF):IFormularioTrasladoColaPDF {
  let TomaDeMuestra:IFormularioTrasladoColaPDF=data;
  return TomaDeMuestra
}
//-----------------Verificacion Hash Traslado Cola-------------------------------------------
hashFormularioTrasladoCola(nombre:string)
{
  // Inicializacion de objeto params
  let params = new HttpParams();
  const encodeHash=encodeURIComponent(nombre);
  params = params.append('hash', nombre);

  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formcola/verificacion`,{params:params});
}
  //-----------------Visualizar operadores-------------------------------------------
  verFormularioTrasladoColaSimple(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formcola/reducido`,{params:params});
  }
  verFormularioTrasladoColaOperadorSimple(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formcola/operador/reducido/`+nombre);
  }
  handleFormularioTrasladoColaSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioTrasladoColaSimple(data: IFormularioTrasladoColaSimple[]):IFormularioTrasladoColaSimple[] {
    let FormularioTrasladoCola:IFormularioTrasladoColaSimple[]=data;
    return FormularioTrasladoCola
  }


//---------------------crear   FormularioTrasladoCola-------------------------------------------
crearFormularioTrasladoCola(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}formcola`,data, {headers:this.headers})
}
handleCrearFormularioTrasladoColaError(error: any): any {
  return error=error;
}
handleCrearFormularioTrasladoCola(data: any):any {
  let FormularioTrasladoCola:any=data;
  return FormularioTrasladoCola
}
//---------------------Editar   FormularioTrasladoCola-------------------------------------------
editarFormularioTrasladoCola(data:IFormularioTrasladoCola,id:number) {
  this.token();
  return this.http.put(`${this.baseUrl}formcola/`+id.toString(), data)
}
handleEditarFormularioTrasladoColaError(error: any): any {
  return error=error;
}
handleEditarFormularioTrasladoCola(data: IFormularioTrasladoCola):IFormularioTrasladoCola {
  let FormularioTrasladoCola:IFormularioTrasladoCola=data;
  return FormularioTrasladoCola
}
//---------------------------Emitir Formulario 101..-----------------------------------------
emitirFormularioTrasladoCola(id:number) {
  this.token();
  let estado:any={
    estado:'EMITIDO'
  }
  return this.http.put(`${this.baseUrl}formcola/emitir/`+id, estado)
}
//---------------------Editar   FormularioTrasladoCola-------------------------------------------
anularFormularioTrasladoCola(data:IFormularioTrasladoCola) {
  let anulado:any={
    estado:'ANULADO',
    justificacion_anulacion:data.justificacion_anulacion
  }
    this.token();
    return this.http.put(`${this.baseUrl}formcola/anular/`+data.id, anulado)
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


