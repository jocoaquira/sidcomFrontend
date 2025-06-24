import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { IFormularioInternoPDF } from '@data/formulario_interno_pdf.metadata';
import { IFormularioInternoEmitidos } from '@data/formulario_interno_emitidos.metadata';
import { Observable } from 'rxjs';
import { IPaginatedResponse } from '@data/PaginatedResponse.metadata';

@Injectable({
  providedIn: 'root'
})
export class FormularioInternosOptService {
  private user!:IApiUserAuthenticated;
  private baseUrl = localStorage.getItem('url-backend');
  private headers!:HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService:AuthService
  ) {


    //this.requestOptions = { headers: headers };
  }
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

    return this.http.get(`${this.baseUrl}formint/reducido-opt`, { params });
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
  return this.http.get(`${this.baseUrl}formint/`+nombre,{params:params});
}
  //-----------------Visualizar operadores-------------------------------------------
  verFormularioInternosSimple(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint/reducido`,{params:params});
  }
  verFormularioInternosOperadorSimple(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint/operador/reducido/`+nombre);
  }
  handleFormularioInternoSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleFormularioInternoSimple(data: IFormularioInternoSimple[]):IFormularioInternoSimple[] {
    let FormularioInterno:IFormularioInternoSimple[]=data;
    return FormularioInterno
  }

verFormularioInternoPDF(nombre:string)
{
  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formint/print/`+nombre);
}
handleFormularioInternoPDF(data: IFormularioInternoPDF):IFormularioInternoPDF {
  let TomaDeMuestra:IFormularioInternoPDF=data;
  return TomaDeMuestra
}
//---------------------crear   FormularioInterno-------------------------------------------
crearFormularioInterno(data:any) {
  this.token();
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
editarFormularioInterno(data:IFormularioInterno,id:number) {
  this.token();
  return this.http.put(`${this.baseUrl}formint/`+id.toString(), data)
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
  return this.http.put(`${this.baseUrl}formint/emitir/`+id, estado)
}
//---------------------Editar   FormularioInterno-------------------------------------------
anularFormularioInterno(data:IFormularioInterno) {
  let anulado:any={
    estado:'ANULADO',
    justificacion_anulacion:data.justificacion_anulacion
  }
    this.token();
    return this.http.put(`${this.baseUrl}formint/anular/`+data.id, anulado)
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
  verReporteFormIntCantidades()
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint/reporte/emitidos`);
  }
  verReporteFormIntCantidadesOperador(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint/reporte/emitidos/`+nombre);
  }

  handleReporteFormIntCantidades(data: IFormularioInternoEmitidos):IFormularioInternoEmitidos {
    let FormularioInterno:IFormularioInternoEmitidos=data;
    return FormularioInterno
  }
  verReporteTopMinerales()
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint/reporte/minerales`);
  }


}


