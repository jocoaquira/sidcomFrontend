import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { ITranca } from '@data/tranca.metadata';

@Injectable({
  providedIn: 'root'
})
export class TrancaService {
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
  verTrancas(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}trancas`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleTrancas(data: ITranca[]):ITranca[] {
    let Tranca:ITranca[]=data;
    return Tranca
  }
  //-----------------------------Ver Tranca---------------------------------
  verTranca(nombre:string)
{
  return this.http.get(`${this.baseUrl}trancas/`+nombre);
}
//---------------------crear   Tranca-------------------------------------------
crearTranca(data:ITranca) {
  this.token();
  return this.http.post(`${this.baseUrl}trancas`,data, {headers:this.headers})
}
handleCrearTrancaError(error: any): any {
  return error=error;
}
handleCrearTranca(data: ITranca):ITranca {
  let Tranca:ITranca=data;
  return Tranca
}
//---------------------Editar   Tranca-------------------------------------------
editarTranca(data:ITranca) {
  this.token();
  return this.http.put(`${this.baseUrl}trancas/`+data.id, data)
}
handleEditarTrancaError(error: any): any {
  return error=error;
}
handleEditarTranca(data: boolean):boolean {
  let Tranca:boolean=data;
  return Tranca
}
//---------------------Eliminar   Tranca-------------------------------------------
eliminarTranca(data:number) {
    this.token();
    return this.http.delete(`${this.baseUrl}trancas/`+data)
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


