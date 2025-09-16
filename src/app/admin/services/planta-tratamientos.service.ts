import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IPlantaDeTratamiento } from '@data/planta_tratamiento.metadata';


@Injectable({
  providedIn: 'root'
})
export class PlantaDeTratamientoService {
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
  verPlantaDeTratamientos(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('id', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}plantatratamiento`,{params:params});
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handlePlantaDeTratamiento(data: IPlantaDeTratamiento[]):IPlantaDeTratamiento[] {
    let plantaDeTratamiento:IPlantaDeTratamiento[]=data;
    return plantaDeTratamiento
  }
  //-------visualizar municipio-------------------------------------------------
  verPlantaDeTratamiento(nombre:string)
{
  return this.http.get(`${this.baseUrl}plantatratamiento/`+nombre);
}
//---------------------crear   plantaDeTratamiento-------------------------------------------
crearplantaDeTratamiento(data:IPlantaDeTratamiento) {
  this.token();
  return this.http.post(`${this.baseUrl}plantatratamiento`,data, {headers:this.headers})
}
handleCrearPlantaDeTratamientoError(error: any): any {
  return error=error;
}
handleCrearPlantaDeTratamiento(data: IPlantaDeTratamiento):IPlantaDeTratamiento {
  let plantaDeTratamiento:IPlantaDeTratamiento=data;
  return plantaDeTratamiento
}
//---------------------Editar   plantaDeTratamiento-------------------------------------------
editarPlantaDeTratamiento(data:IPlantaDeTratamiento) {
  this.token();
  return this.http.put(`${this.baseUrl}plantatratamiento/`+data.id, data)
}
handleEditarPlantaDeTratamientoError(error: any): any {
  return error=error;
}
handleEditarPlantaDeTratamiento(data: boolean):boolean {
  let plantaDeTratamiento:boolean=data;
  return plantaDeTratamiento
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


