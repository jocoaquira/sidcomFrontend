import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IOperator } from '../data/operator.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
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
  veroperators(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}operator`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleoperator(data: IOperator[]):IOperator[] {
    let operator:IOperator[]=data;
    return operator
  }
  //-------------------ver Operador------------------------------------------------------
  verOperator(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}operator/`+nombre);
  }
  //-----------------Visualizar Operador Hash-------------------------------------------
  hashOperador(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    const encodeHash=encodeURIComponent(nombre);
    params = params.append('hash', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}operator/verificacion`,{params:params});
  }
  handleOperador(data: IOperator):IOperator {
    let operator:IOperator=data;
    return operator
  }
  //-----------------Visualizar operadores-------------------------------------------
  verOperatorsSimple(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}operator/operators-simple`,{params:params});
  }
  handleOperatorSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleOperatorSimple(data: IOperator[]):IOperator[] {
    let operator:IOperator[]=data;
    return operator
  }


//---------------------crear   operator-------------------------------------------
crearoperator(formData: FormData): Observable<any> {
  //this.token(); // Si es necesario, agrega la lógica para obtener el token
  // Llamamos a la API con el FormData

  return this.http.post(`${this.baseUrl}operator`, formData);
}
crearoperatore(data:IOperator) {
  this.token();
  return this.http.post(`${this.baseUrl}operator`,data, {headers:this.headers})
}
handleCrearoperatorError(error: any): any {
  return error=error;
}
handleCrearoperator(data: IOperator):IOperator {
  let operator:IOperator=data;
  return operator
}
//---------------------Editar   operator-------------------------------------------
editaroperator(data:IOperator) {
  this.token();
  return this.http.put(`${this.baseUrl}operator/`+data.id, data)
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


