import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IVehiculo } from '@data/vehiculo.metadata';

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
  handleusuario(data: IVehiculo[]):IVehiculo[] {
    let usuario:IVehiculo[]=data;
    return usuario
  }

//---------------------crear   usuario-------------------------------------------
crearVehiculo(data:IVehiculo) {
  this.token();
  return this.http.post(`${this.baseUrl}vehiculo`,data, {headers:this.headers})
}
handleCrearusuarioError(error: any): any {
  return error=error;
}
handleCrearusuario(data: IVehiculo):IVehiculo {
  let usuario:IVehiculo=data;
  return usuario
}
//---------------------Editar   usuario-------------------------------------------
editarVehiculo(data:IVehiculo) {
  this.token();
  return this.http.put(`${this.baseUrl}vehiculo/`+data.id, data)
}
handleEditarusuarioError(error: any): any {
  return error=error;
}
handleEditarusuario(data: boolean):boolean {
  let usuario:boolean=data;
  return usuario
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


