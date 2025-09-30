import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IComprador } from '@data/comprador.metadata';
import { IFormularioInternoReporte } from '@data/reports/formulario_interno.metadata';
import { IFormularioControlTranca } from '@data/reports/formulario_control_puesto.metadata';


@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private user!:IApiUserAuthenticated;
  private baseUrl = localStorage.getItem('url-backend');
  private headers!:HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService:AuthService
  ) {


    //this.requestOptions = { headers: headers };
  }
//-----------------Visualizar Reporte Formulario 101-------------------------------------------
  listarFormulariosInternoReporte(fecha_inicio:string,fecha_fin:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('fecha_inicio', fecha_inicio);
    params = params.append('fecha_fin', fecha_fin);
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint/reporte/general`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleListarFormulariosInternoReporte(data: IFormularioInternoReporte[]):IFormularioInternoReporte[] {
    let Comprador:IFormularioInternoReporte[]=data;
    return Comprador
  }
//-----------------Visualizar Reporte Formulario 101-------------------------------------------
  listarFormulariosControlTrancaReporte(fecha_inicio:string,fecha_fin:string,usuario_id:number)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('fecha_inicio', fecha_inicio);
    params = params.append('fecha_fin', fecha_fin);
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}controltrancas/usuario/`+usuario_id,{params:params});
  }

  handleFormulariosControlTrancaReporte(data: IFormularioControlTranca[]):IFormularioControlTranca[] {
    let Comprador:IFormularioControlTranca[]=data;
    return Comprador
  }
  //-------visualizar municipio----------IFormularioControlTranca---------------------------------------
  verComprador(nombre:string)
{
  return this.http.get(`${this.baseUrl}comprador/`+nombre);
}
//---------------------crear   Comprador-------------------------------------------
crearComprador(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}comprador`,data, {headers:this.headers})
}
handleCrearCompradorError(error: any): any {
  return error=error;
}
handleCrearComprador(data: IComprador):IComprador {
  let Comprador:IComprador=data;
  return Comprador
}
//---------------------Editar   Comprador-------------------------------------------
editarComprador(data:IComprador) {
  this.token();
  return this.http.put(`${this.baseUrl}comprador/`+data.id, data)
}
handleEditarCompradorError(error: any): any {
  return error=error;
}
handleEditarComprador(data: boolean):boolean {
  let Comprador:boolean=data;
  return Comprador
}
//---------------------Eliminar   Comprador-------------------------------------------
eliminarComprador(data:number) {
    this.token();
    return this.http.delete(`${this.baseUrl}comprador/`+data)
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


