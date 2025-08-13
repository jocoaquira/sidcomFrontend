import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { ITipoTransporte } from '@data/tipo_transporte.metadata';


@Injectable({
  providedIn: 'root'
})
export class TipoTransporteService {
  private user!:IApiUserAuthenticated;
  private baseUrl = localStorage.getItem('url-backend');
  private headers!:HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService:AuthService
  ) {
    //this.requestOptions = { headers: headers };
  }
//-----------------Visualizar Tipo Transporte-------------------------------------------
  verTipoTransportes(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}tipotransporte`,{params:params});
  }

  handleError(error: any): any {
    return error=error.error.error;
  }

  handleTipoTransportes(data: ITipoTransporte[]):ITipoTransporte[] {
    let tipoTransporte:ITipoTransporte[]=data;
    return tipoTransporte
  }
//-----------------Ver de Roles-------------------------------------------
  verTipoTransporte(data:any)
  {
    return this.http.get(`${this.baseUrl}tipotransporte/`+data);
  }
  handleTipoTransporte(data: ITipoTransporte):ITipoTransporte {
    let tipoTransporte:ITipoTransporte=data;
    return tipoTransporte
  }

//---------------------crear   tipoTransporte-------------------------------------------
crearTipoTransporte(data:ITipoTransporte) {
  this.token();
  return this.http.post(`${this.baseUrl}tipotransporte`,data, {headers:this.headers})
}
handleCreartipoTransporteError(error: any): any {
  return error=error;
}
handleCreartipoTransporte(data: ITipoTransporte):ITipoTransporte {
  let tipoTransporte:ITipoTransporte=data;
  return tipoTransporte
}
//---------------------Editar   tipoTransporte-------------------------------------------
editarTipoTransporte(data:ITipoTransporte) {
  this.token();
  return this.http.put(`${this.baseUrl}tipotransporte/`+data.id, data)
}
handleEditartipoTransporteError(error: any): any {
  return error=error;
}
handleEditartipoTransporte(data: boolean):boolean {
  let tipoTransporte:boolean=data;
  return tipoTransporte
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


