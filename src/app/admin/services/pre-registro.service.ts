import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IOperator } from '../data/operator.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreRegistroService {
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
  verPreRegistros(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}preregistro`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleoperator(data: IOperator[]):IOperator[] {
    let operator:IOperator[]=data;
    return operator
  }
  //-------------------ver Operador------------------------------------------------------
  verPreRegistro(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}preregistro/`+nombre);
  }
  //-----------------Visualizar Operador Hash-------------------------------------------
  hashOperador(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    const encodeHash=encodeURIComponent(nombre);
    params = params.append('hash', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}preregistro/verificacion`,{params:params});
  }
  handleOperador(data: IOperator):IOperator {
    let operator:IOperator=data;
    return operator
  }
  //-----------------Visualizar operadores-------------------------------------------
  verPreRegistroSimple(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}preregistro/PreRegistro-simple`,{params:params});
  }
  handlePreRegistroimpleError(error: any): any {
    return error=error.error.error;
  }
  handlePreRegistroimple(data: IOperator[]):IOperator[] {
    let operator:IOperator[]=data;
    return operator
  }


//---------------------crear   operator-------------------------------------------

crearPreRegistro(data:IOperator) {
  this.token();
  return this.http.post(`${this.baseUrl}preregistro`,data, {headers:this.headers})
}
handleCrearoperatorError(error: any): any {
  return error=error;
}
handleCrearoperator(data: IOperator):IOperator {
  let operator:IOperator=data;
  return operator
}
//---------------------Editar   operator-------------------------------------------
editarPreRegistro(id:string,data:FormData) {
  return this.http.put(`${this.baseUrl}preregistro/`+id, data)
}

handleEditaroperatorError(error: any): any {
  return error=error;
}
handleEditaroperator(data: boolean):boolean {
  let operator:boolean=data;
  return operator
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


