import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IMunicipio } from '@data/municipio.metadata';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {
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
  vermunicipios(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('departamento_id', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}municipio`,{params:params});
  }
  verTodosMunicipios()
  {

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}municipio`);
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlemunicipio(data: IMunicipio[]):IMunicipio[] {
    let municipio:IMunicipio[]=data;
    return municipio
  }
//-------visualizar municipio-------------------------------------------------
  verMunicipio(nombre:string)
{
  return this.http.get(`${this.baseUrl}municipio/`+nombre);
}
//---------------------crear   municipio-------------------------------------------
crearmunicipio(data:IMunicipio) {
  this.token();
  return this.http.post(`${this.baseUrl}/municipio`,data, {headers:this.headers})
}
handleCrearmunicipioError(error: any): any {
  return error=error;
}
handleCrearmunicipio(data: IMunicipio):IMunicipio {
  let municipio:IMunicipio=data;
  return municipio
}
//---------------------Editar   municipio-------------------------------------------
editarmunicipio(data:IMunicipio) {
  this.token();
  return this.http.put(`${this.baseUrl}/municipio/`+data.id, data)
}
handleEditarmunicipioError(error: any): any {
  return error=error;
}
handleEditarmunicipio(data: boolean):boolean {
  let municipio:boolean=data;
  return municipio
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


