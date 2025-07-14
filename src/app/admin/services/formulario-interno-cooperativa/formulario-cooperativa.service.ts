import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { IFormularioInternoCooperativaPDF } from '@data/formulario_interno_cooperativa_pdf.metadata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormularioCooperativaService {
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
  verFormularioCooperativa(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formintcooperativa/`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioInterno(data: IFormularioInterno[]):IFormularioInterno[] {
    let FormularioInterno:IFormularioInterno[]=data;
    return FormularioInterno
  }
  //-----------------Verificacion Hash Traslado Cola-------------------------------------------
  hashFormularioInternoCooperativa(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    const encodeHash=encodeURIComponent(nombre);
    params = params.append('hash', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formintcooperativa/verificacion`,{params:params});
  }
//-----------------Visualizar Formulario Interno-------------------------------------------
verFormularioInterno(nombre:string)
{
  // Inicializacion de objeto params
  let params = new HttpParams();
  params = params.append('id', nombre);

  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formintcooperativa/`+nombre,{params:params});
}
  //-----------------Visualizar operadores-------------------------------------------
  verFormularioCooperativaSimple(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formintcooperativa/reducido`,{params:params});
  }
    //-------------------------Simple Formulario Reducido------------------------------------
    getFormReducidoOptimizado(
      page: number = 1,
      pageSize: number = 30,
      searchTerm: string = '',
      sortField: string = 'id',
      sortOrder: number = -1
    ): Observable<any> {
      // Parámetros HTTP para paginación, búsqueda y ordenamiento
      const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', searchTerm)
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

      return this.http.get(`${this.baseUrl}formintcooperativa/reducido-opt`, { params });
    }
//---------------------------------------------------------------------------------------------
  verFormularioCooperativaOperadorSimple(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formintcooperativa/operador/reducido/`+nombre);
  }
  handleFormularioInternoSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioInternoSimple(data: IFormularioInternoSimple[]):IFormularioInternoSimple[] {
    let FormularioInterno:IFormularioInternoSimple[]=data;
    return FormularioInterno
  }

//-----------------Visualizar Toma de Muestra-------------------------------------------
verFormularioInternoCooperativaHash(nombre:string)
{
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('hash', nombre);
  // asignacion de parametros
    return this.http.get(`${this.baseUrl}formintcooperativa/verificacion/`,{params:params});
}
verFormularioInternoCooperativaPDF(nombre:string)
{
  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formintcooperativa/print/`+nombre);
}
handleFormularioInternoCooperativaPDF(data: IFormularioInternoCooperativaPDF):IFormularioInternoCooperativaPDF {
  let TomaDeMuestra:IFormularioInternoCooperativaPDF=data;
  return TomaDeMuestra
}
//---------------------crear   FormularioInterno-------------------------------------------
crearFormularioInterno(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}formintcooperativa`,data, {headers:this.headers})
}
handleCrearFormularioInternoError(error: any): any {
  return error=error;
}
handleCrearFormularioInterno(data: any):any {
  let FormularioInterno:any=data;
  return FormularioInterno
}
//---------------------Editar   FormularioInterno-------------------------------------------
editarFormularioInterno(data:IFormularioInterno,id:number) {
  this.token();
  return this.http.put(`${this.baseUrl}formintcooperativa/`+id.toString(), data)
}
handleEditarFormularioInternoError(error: any): any {
  return error=error;
}
handleEditarFormularioInterno(data: IFormularioInterno):IFormularioInterno {
  let FormularioInterno:IFormularioInterno=data;
  return FormularioInterno
}
//---------------------------Emitir Formulario 101..-----------------------------------------
emitirFormularioInterno(id:number) {
  this.token();
  let estado:any={
    estado:'EMITIDO'
  }
  return this.http.put(`${this.baseUrl}formintcooperativa/emitir/`+id, estado)
}
//---------------------Editar   FormularioInterno-------------------------------------------
anularFormularioInterno(data:IFormularioInterno) {
  let anulado:any={
    estado:'ANULADO',
    justificacion_anulacion:data.justificacion_anulacion
  }
    this.token();
    return this.http.put(`${this.baseUrl}formintcooperativa/anular/`+data.id, anulado)
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


