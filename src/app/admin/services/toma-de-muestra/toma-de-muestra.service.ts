import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { ITomaDeMuestra } from '@data/toma_de_muestra.metadata';

@Injectable({
  providedIn: 'root'
})
export class TomaDeMuestraService {
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
  verTomaDeMuestras(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleTomaDeMuestra(data: ITomaDeMuestra[]):ITomaDeMuestra[] {
    let TomaDeMuestra:ITomaDeMuestra[]=data;
    return TomaDeMuestra
  }
//-----------------Visualizar Formulario Interno-------------------------------------------
verTomaDeMuestra(nombre:string)
{
  // Inicializacion de objeto params
  let params = new HttpParams();
  params = params.append('id', nombre);

  // asignacion de parametros
  return this.http.get(`${this.baseUrl}formint/`+nombre,{params:params});
}
  //-----------------Visualizar operadores-------------------------------------------
  verTomaDeMuestrasSimple(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}formint/reducido`,{params:params});
  }
  handleTomaDeMuestraSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleTomaDeMuestraSimple(data: ITomaDeMuestraSimple[]):ITomaDeMuestraSimple[] {
    let TomaDeMuestra:ITomaDeMuestraSimple[]=data;
    return TomaDeMuestra
  }


//---------------------crear   TomaDeMuestra-------------------------------------------
crearTomaDeMuestra(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}formint`,data, {headers:this.headers})
}
handleCrearTomaDeMuestraError(error: any): any {
  return error=error;
}
handleCrearTomaDeMuestra(data: any):any {
  let TomaDeMuestra:any=data;
  return TomaDeMuestra
}
//---------------------Editar   TomaDeMuestra-------------------------------------------
editarTomaDeMuestra(data:ITomaDeMuestra,id:number) {
  this.token();
  console.log(id);
  return this.http.put(`${this.baseUrl}formint/`+id.toString(), data)
}
handleEditarTomaDeMuestraError(error: any): any {
  return error=error;
}
handleEditarTomaDeMuestra(data: ITomaDeMuestra):ITomaDeMuestra {
  let TomaDeMuestra:ITomaDeMuestra=data;
  return TomaDeMuestra
}
//---------------------------Emitir Formulario 101..-----------------------------------------
emitirTomaDeMuestra(id:number) {
  this.token();
  let estado:any={
    estado:'EMITIDO'
  }
  return this.http.put(`${this.baseUrl}formint/emitir/`+id, estado)
}
//---------------------Editar   TomaDeMuestra-------------------------------------------
anularTomaDeMuestra(data:ITomaDeMuestra) {
  let anulado:any={
    estado:'ANULADO',
    justificacion_anulacion:data.justificacion_anulacion
  }
    this.token();
    return this.http.put(`${this.baseUrl}formint/anular/`+data.id, anulado)
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


