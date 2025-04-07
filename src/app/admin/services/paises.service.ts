import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IPais } from '@data/pais.metadata';


@Injectable({
  providedIn: 'root'
})
export class PaisesService {
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
  verpaises(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}pais`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlepais(data: IPais[]):IPais[] {
    let pais:IPais[]=data;
    return pais
  }
  //-----------------------------Ver Pais---------------------------------
  verPais(nombre:string)
{
  return this.http.get(`${this.baseUrl}pais/`+nombre);
}
//---------------------crear   pais-------------------------------------------
crearpais(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}pais`,data, {headers:this.headers})
}
handleCrearpaisError(error: any): any {
  return error=error;
}
handleCrearpais(data: IPais):IPais {
  let pais:IPais=data;
  return pais
}
//---------------------Editar   pais-------------------------------------------
editarpais(data:IPais) {
  this.token();
  return this.http.put(`${this.baseUrl}pais/`+data.id, data)
}
handleEditarpaisError(error: any): any {
  return error=error;
}
handleEditarpais(data: boolean):boolean {
  let pais:boolean=data;
  return pais
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


