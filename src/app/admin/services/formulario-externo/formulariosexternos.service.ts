import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioExterno } from '@data/formulario_externo.metadata';
import { IFormularioExternoSimple } from '@data/formulario_externo_simple.metadata';
import { IFormularioExternoPDF } from '@data/formulario_externo_pdf.metadata';
import { IFormularioInternoEmitidos } from '@data/formulario_interno_emitidos.metadata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormularioExternosService {
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
  verFormularioExternos(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formext`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioExterno(data: IFormularioExterno[]):IFormularioExterno[] {
    let FormularioExterno:IFormularioExterno[]=data;
    return FormularioExterno
  }
//-----------------Visualizar Formulario Interno-------------------------------------------
verFormularioExterno(nombre:string)
{
  // Inicializacion de objeto params
  let params = new HttpParams();
  params = params.append('id', nombre);

  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formext/`+nombre,{params:params});
}
  //-----------------Visualizar operadores-------------------------------------------
  verFormularioExternosSimple(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formext/reducido`,{params:params});
  }
  verFormularioExternosOperadorSimple(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formext/operador/reducido/`+nombre);
  }
  handleFormularioExternoSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioExternoSimple(data: IFormularioExternoSimple[]):IFormularioExternoSimple[] {
    let FormularioExterno:IFormularioExternoSimple[]=data;
    return FormularioExterno
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

    return this.http.get(`${this.baseUrl}formext/reducido-opt`, { params });
  }
//-----------------Visualizar Toma de Muestra-------------------------------------------
verFormularioExternoPDF(nombre:string)
{
  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formext/print/`+nombre);
}
handleFormularioExternoPDF(data: IFormularioExternoPDF):IFormularioExternoPDF {
  let TomaDeMuestra:IFormularioExternoPDF=data;
  return TomaDeMuestra
}
//---------------------crear   FormularioExterno-------------------------------------------
crearFormularioExterno(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}formext`,data, {headers:this.headers})
}
handleCrearFormularioExternoError(error: any): any {
  return error=error;
}
handleCrearFormularioExterno(data: any):any {
  let FormularioExterno:any=data;
  return FormularioExterno
}
//---------------------Editar   FormularioExterno-------------------------------------------
editarFormularioExterno(data:IFormularioExterno,id:number) {
  this.token();
  return this.http.put(`${this.baseUrl}formext/`+id.toString(), data)
}
handleEditarFormularioExternoError(error: any): any {
  return error=error;
}
handleEditarFormularioExterno(data: IFormularioExterno):IFormularioExterno {
  let FormularioExterno:IFormularioExterno=data;
  return FormularioExterno
}
//---------------------------Emitir Formulario 101..-----------------------------------------
emitirFormularioExterno(id:number) {
  this.token();
  let estado:any={
    estado:'EMITIDO'
  }
  return this.http.put(`${this.baseUrl}formext/emitir/`+id, estado)
}
//---------------------Editar   FormularioExterno-------------------------------------------
anularFormularioExterno(data:IFormularioExterno) {
  let anulado:any={
    estado:'ANULADO',
    justificacion_anulacion:data.justificacion_anulacion
  }
    this.token();
    return this.http.put(`${this.baseUrl}formext/anular/`+data.id, anulado)
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
  //-----------------Visualizar Reportes-------------------------------------------
  verReporteFormExtCantidades()
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formext/reporte/emitidos`);
  }
  verReporteFormExtCantidadesOperador(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formext/reporte/emitidos/`+nombre);
  }

  handleReporteFormExtCantidades(data: IFormularioInternoEmitidos):IFormularioInternoEmitidos {
    let FormularioInterno:IFormularioInternoEmitidos=data;
    return FormularioInterno
  }
  verReporteTopMinerales()
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formext/reporte/minerales`);
  }

}


