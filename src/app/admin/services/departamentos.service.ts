import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IDepartamento } from '@data/departamento.metadata';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {
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
  verdepartamentos(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}departamento`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handledepartamento(data: IDepartamento[]):IDepartamento[] {
    let departamento:IDepartamento[]=data;
    return departamento
  }
//---------------------crear   departamento-------------------------------------------
creardepartamento(data:IDepartamento) {
  this.token();
  return this.http.post(`${this.baseUrl}/departamento`,data, {headers:this.headers})
}
handleCreardepartamentoError(error: any): any {
  return error=error;
}
handleCreardepartamento(data: IDepartamento):IDepartamento {
  let departamento:IDepartamento=data;
  return departamento
}
//---------------------Editar   departamento-------------------------------------------
editardepartamento(data:IDepartamento) {
  this.token();
  return this.http.put(`${this.baseUrl}/departamentos`+data.id, data)
}
handleEditardepartamentoError(error: any): any {
  return error=error;
}
handleEditardepartamento(data: boolean):boolean {
  let departamento:boolean=data;
  return departamento
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


