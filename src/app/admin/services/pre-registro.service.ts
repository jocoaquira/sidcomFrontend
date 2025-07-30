import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IOperator } from '../data/operator.metadata';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreRegistroService {
    private notificacionesUpdated = new Subject<number>();

    // Observable para componentes
    notificaciones$ = this.notificacionesUpdated.asObservable();


  private baseUrl = localStorage.getItem('url-backend');
  private headers!:HttpHeaders;
  constructor(
    private http: HttpClient,
  ) {


    //this.requestOptions = { headers: headers };
  }
//-----------------Visualizar operadores-------------------------------------------
  verPreRegistros(
      page: number = 1,
      pageSize: number = 30,
      searchTerm: string = '',
      sortField: string = 'id',
      sortOrder: number = -1
    ): Observable<any> {
      // Parámetros HTTP para paginación, búsqueda y ordenamiento
      const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', searchTerm)
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

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
    return this.http.get(`${this.baseUrl}preregistro/print/`+nombre);
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
editarPreRegistro(id:string,data:any) {
  return this.http.put(`${this.baseUrl}preregistro/`+id, data)
}

handleEditaroperatorError(error: any): any {
  return error=error;
}
handleEditaroperator(data: boolean):boolean {
  let operator:boolean=data;
  return operator
}

//-------------------------CDONTAR SOLICITUDES------------------------------------------
contarSolicitudes() {
    return this.http.get(`${this.baseUrl}preregistro/contar_solicitudes`).pipe(
      tap((count:number) => this.notificacionesUpdated.next(count))
    );
  }

}


