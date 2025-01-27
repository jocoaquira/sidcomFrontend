import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { ITomaDeMuestraMunicipioOrigen } from '@data/toma_de_muestra_municipio_origen.metadata';

@Injectable({
  providedIn: 'root'
})
export class TomaDeMuestraMunicipioOrigenService {
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
  verTomaDeMuestraMunicipioOrigen(nombre:string)
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
  handleTomaDeMuestraMunicipioOrigen(data: ITomaDeMuestraMunicipioOrigen[]):ITomaDeMuestraMunicipioOrigen[] {
    let TomaDeMuestraMunicipioOrigen:ITomaDeMuestraMunicipioOrigen[]=data;
    return TomaDeMuestraMunicipioOrigen
  }



//---------------------crear   TomaDeMuestraMunicipioOrigen-------------------------------------------
crearTomaDeMuestraMunicipioOrigen(data:ITomaDeMuestraMunicipioOrigen) {
  this.token();
  return this.http.post(`${this.baseUrl}form-int-municipio-origen`,data, {headers:this.headers})
}
handleCrearTomaDeMuestraMunicipioOrigenError(error: any): any {
  return error=error;
}
handleCrearTomaDeMuestraMunicipioOrigen(data: ITomaDeMuestraMunicipioOrigen):ITomaDeMuestraMunicipioOrigen {
  let TomaDeMuestraMunicipioOrigen:ITomaDeMuestraMunicipioOrigen=data;
  return TomaDeMuestraMunicipioOrigen
}
//---------------------Editar   TomaDeMuestraMunicipioOrigen-------------------------------------------
editarTomaDeMuestraMunicipioOrigen(data:ITomaDeMuestraMunicipioOrigen) {
  this.token();
  return this.http.put(`${this.baseUrl}form-int-municipio-origen/`+data.id, data)
}
handleEditarTomaDeMuestraMunicipioOrigenError(error: any): any {
  return error=error;
}
handleEditarTomaDeMuestraMunicipioOrigen(data: boolean):boolean {
  let TomaDeMuestraMunicipioOrigen:boolean=data;
  return TomaDeMuestraMunicipioOrigen
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


