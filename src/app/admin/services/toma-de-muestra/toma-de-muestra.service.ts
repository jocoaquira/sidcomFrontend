import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IAnulacionTomaDeMuestra, ITomaDeMuestra } from '@data/toma_de_muestra.metadata';
import { ITomaDeMuestraSimple } from '@data/toma_de_muestra_simple.metadata';
import { ITomaDeMuestraSimpleOperador } from '@data/toma_de_muestra_simple_operador.metadata';
import { IAprobarTM } from '@data/aprobar_tm.metadata';
import { ITomaDeMuestraPDF } from '@data/toma_de_muestra_pdf.metadata';
import { Observable } from 'rxjs';

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
  verTomaDeMuestras()
  {
    
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}sample`);
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleTomaDeMuestra(data: ITomaDeMuestra[]):ITomaDeMuestra[] {
    let TomaDeMuestra:ITomaDeMuestra[]=data;
    return TomaDeMuestra
  }
  //-----------------Visualizar operadores-------------------------------------------
  verTomaDeMuestrasOperador(id:number)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}sample/operador/`+id);
  }

//-----------------Visualizar Toma de Muestra-------------------------------------------
verTomaDeMuestra(nombre:string)
{
  // Inicializacion de objeto params
  let params = new HttpParams();
  params = params.append('id', nombre);

  // asignacion de parametros
  return this.http.get(`${this.baseUrl}sample/`+nombre,{params:params});
}
//-----------------Visualizar Toma de Muestra-------------------------------------------
verTomaDeMuestraPDF(nombre:string)
{
  // asignacion de parametros
  return this.http.get(`${this.baseUrl}sample/print/`+nombre);
}
handleTomaDeMuestraPDF(data: ITomaDeMuestraPDF):ITomaDeMuestraPDF {
  let TomaDeMuestra:ITomaDeMuestraPDF=data;
  return TomaDeMuestra
}
  //-----------------Visualizar TDMuestra Simple-------------------------------------------
  verTomaDeMuestrasSimple()
  {

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}sample/reducido`);
  }
  handleTomaDeMuestraSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleTomaDeMuestraSimple(data: ITomaDeMuestraSimple[]):ITomaDeMuestraSimple[] {
    let TomaDeMuestra:ITomaDeMuestraSimple[]=data;
    return TomaDeMuestra
  }
  //-----------------Visualizar TDMuestra Simple-------------------------------------------
  verTomaDeMuestrasSimpleOperador(id:number)
  {

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}sample/operador/reducido/`+id);
  }
  handleTomaDeMuestraOperadorSimpleError(error: any): any {
    return error=error.error.error;
  }
  handleTomaDeMuestraOperadorSimple(data: ITomaDeMuestraSimpleOperador[]):ITomaDeMuestraSimpleOperador[] {
    let TomaDeMuestra:ITomaDeMuestraSimpleOperador[]=data;
    return TomaDeMuestra
  }

//---------------------crear   TomaDeMuestra-------------------------------------------
crearTomaDeMuestra(data:any) {
  this.token();
  return this.http.post(`${this.baseUrl}sample`,data, {headers:this.headers})
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
  return this.http.put(`${this.baseUrl}sample/`+id.toString(), data)
}
handleEditarTomaDeMuestraError(error: any): any {
  return error=error;
}
handleEditarTomaDeMuestra(data: ITomaDeMuestra):ITomaDeMuestra {
  let TomaDeMuestra:ITomaDeMuestra=data;
  return TomaDeMuestra
}
//---------------------Editar   TomaDeMuestra-------------------------------------------
solicitarTomaDeMuestra(id:number) {
  let sol={
    'estado':'SOLICITADO'
  }
  this.token();
  return this.http.put(`${this.baseUrl}sample/solicitar/`+id.toString(), sol)
}
firmarTomaDeMuestra(id:number) {
  let sol={
    'estado':'FIRMADO'
  }
  this.token();
  return this.http.put(`${this.baseUrl}sample/firmar/`+id.toString(), sol)
}

// Función para aprobar la toma de muestra
aprobarTomaDeMuestra(formData: FormData,id:number): Observable<any> {
  this.token(); // Si es necesario, agrega la lógica para obtener el token

  // Llamamos a la API con el FormData
  return this.http.put(`${this.baseUrl}sample/aprobar/`+id, formData);
}
handleAprobarTomaDeMuestraError(error: any): any {
  return error=error;
}
handleAprobarTomaDeMuestra(data: IAprobarTM):IAprobarTM {
  let TomaDeMuestra:IAprobarTM=data;
  return TomaDeMuestra
}

//---------------------------Emitir Formulario 101..-----------------------------------------
emitirTomaDeMuestra(id:number) {
  this.token();
  let estado:any={
    estado:'EMITIDO'
  }
  return this.http.put(`${this.baseUrl}sample/emitir/`+id, estado)
}
//---------------------Editar   TomaDeMuestra-------------------------------------------
anularTomaDeMuestra(data:IAnulacionTomaDeMuestra) {
    this.token();
    return this.http.put(`${this.baseUrl}sample/anular/`+data.id, data)
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


