import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IVehiculo } from '@data/vehiculo.metadata';
import { IVehiculoAdmin } from '@data/vehiculo_admin.metadata';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
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
  verVehiculos(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}vehiculo`,{params:params});
  }
  verVehiculoOperador(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}vehiculo/operador/`+nombre);
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlevehiculo(data: IVehiculo[]):IVehiculo[] {
    let vehiculo:IVehiculo[]=data;
    return vehiculo
  }
  handlevehiculoAdmin(data: IVehiculoAdmin[]):IVehiculoAdmin[] {
    let vehiculo:IVehiculoAdmin[]=data;
    return vehiculo
  }

//---------------------crear   vehiculo-------------------------------------------
crearVehiculo(data:IVehiculo) {
  this.token();
  return this.http.post(`${this.baseUrl}vehiculo`,data, {headers:this.headers})
}
handleCrearvehiculoError(error: any): any {
  return error=error;
}
handleCrearvehiculo(data: IVehiculo):IVehiculo {
  let vehiculo:IVehiculo=data;
  return vehiculo
}
//---------------------Editar   vehiculo-------------------------------------------
editarVehiculo(data:IVehiculo) {
  this.token();
  return this.http.put(`${this.baseUrl}vehiculo/`+data.id, data)
}
handleEditarvehiculoError(error: any): any {
  return error=error;
}
handleEditarvehiculo(data: boolean):boolean {
  let vehiculo:boolean=data;
  return vehiculo
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


