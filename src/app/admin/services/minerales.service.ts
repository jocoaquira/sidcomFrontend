import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IMineral } from '@data/mineral.metadata';

@Injectable({
  providedIn: 'root'
})
export class MineralsService {
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
  verminerals(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('id', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}mineral`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlemineral(data: IMineral[]):IMineral[] {
    let mineral:IMineral[]=data;
    return mineral
  }
//---------------------crear   mineral-------------------------------------------
crearmineral(data:IMineral) {
  this.token();
  return this.http.post(`${this.baseUrl}/mineral`,data, {headers:this.headers})
}
handleCrearmineralError(error: any): any {
  return error=error;
}
handleCrearmineral(data: IMineral):IMineral {
  let mineral:IMineral=data;
  return mineral
}
//---------------------Editar   mineral-------------------------------------------
editarmineral(data:IMineral) {
  this.token();
  return this.http.put(`${this.baseUrl}/mineral/`+data.id, data)
}
handleEditarmineralError(error: any): any {
  return error=error;
}
handleEditarmineral(data: boolean):boolean {
  let mineral:boolean=data;
  return mineral
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


