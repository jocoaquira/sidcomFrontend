import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { ITurnoTranca, ITurnoTrancaLista } from '@data/turno_tranca.metadata';
import { IFuncionarioTranca } from '@data/funcionarioTranca.metadata';


@Injectable({
  providedIn: 'root'
})
export class TurnoTrancaService {
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
  verTurnoTrancas(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}turnotrancas`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleTurnoTranca(data: ITurnoTrancaLista[]):ITurnoTrancaLista[] {
    let TurnoTranca:ITurnoTrancaLista[]=data;
    return TurnoTranca
  }
   //-----------------Visualizar operadores-------------------------------------------
    verFuncionarioTrancas(nombre:string)
    {
      // Inicializacion de objeto params
      let params = new HttpParams();
      params = params.append('nombre', nombre);

      // asignacion de parametros
      return this.http.get(`${this.baseUrl}turnotrancas/funcionarios`,{params:params});
    }
    handleListarFuncionarioTrancas(data: IFuncionarioTranca[]):IFuncionarioTranca[] {
      let ControlTranca:IFuncionarioTranca[]=data;
      return ControlTranca
    }
  //-----------------------------Ver TurnoTranca---------------------------------
  verTurnoTranca(nombre:string)
{
  return this.http.get(`${this.baseUrl}turnot rancas/`+nombre);
}
//---------------------crear   TurnoTranca-------------------------------------------
crearTurnoTranca(data:ITurnoTranca) {
  this.token();
  return this.http.post(`${this.baseUrl}turnotrancas`,data, {headers:this.headers})
}
handleCrearTurnoTrancaError(error: any): any {
  return error=error;
}
handleCrearTurnoTranca(data: ITurnoTranca):ITurnoTranca {
  let TurnoTranca:ITurnoTranca=data;
  return TurnoTranca
}
//---------------------Editar   TurnoTranca-------------------------------------------
editarTurnoTranca(data:ITurnoTranca) {
  this.token();
  return this.http.put(`${this.baseUrl}turnotrancas/`+data.id, data)
}
handleEditarTurnoTrancaError(error: any): any {
  return error=error;
}
handleEditarTurnoTranca(data: boolean):boolean {
  let TurnoTranca:boolean=data;
  return TurnoTranca
}
//---------------------Eliminar   TurnoTranca-------------------------------------------
eliminarTurnoTranca(data:number) {
    this.token();
    return this.http.delete(`${this.baseUrl}turnotrancas/`+data)
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


