import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { ITomaDeMuestraMineral } from '@data/toma_de_muestra_mineral.metadata';

@Injectable({
  providedIn: 'root'
})
export class TomaDeMuestraMineralService {
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
  verTomaDeMuestraMineral(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('formulario_int_id', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}toma-de-muestra-minerales`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleTomaDeMuestraMineral(data: ITomaDeMuestraMineral[]):ITomaDeMuestraMineral[] {
    let TomaDeMuestraMineral:ITomaDeMuestraMineral[]=data;
    return TomaDeMuestraMineral
  }



//---------------------crear   TomaDeMuestraMineral-------------------------------------------
crearTomaDeMuestraMineral(data:ITomaDeMuestraMineral) {
  this.token();
  return this.http.post(`${this.baseUrl}toma-de-muestra-minerales`,data, {headers:this.headers})
}
handleCrearTomaDeMuestraMineralError(error: any): any {
  return error=error;
}
handleCrearTomaDeMuestraMineral(data: ITomaDeMuestraMineral):ITomaDeMuestraMineral {
  let TomaDeMuestraMineral:ITomaDeMuestraMineral=data;
  return TomaDeMuestraMineral
}
//---------------------Editar   TomaDeMuestraMineral-------------------------------------------
editarTomaDeMuestraMineral(data:ITomaDeMuestraMineral) {
  this.token();
  return this.http.put(`${this.baseUrl}toma-de-muestra-minerales/`+data.id, data)
}
handleEditarTomaDeMuestraMineralError(error: any): any {
  return error=error;
}
handleEditarTomaDeMuestraMineral(data: boolean):boolean {
  let TomaDeMuestraMineral:boolean=data;
  return TomaDeMuestraMineral
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


