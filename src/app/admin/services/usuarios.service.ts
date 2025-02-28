import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IUsuario } from '../data/usuario.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@core/authentication/data/iapi-auth-user.metadata';
import { IUsuarioCompleto } from '@data/usuario_completo.metadata';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
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
  verusuarios(nombre:string)
  {
    // Inicializacion de objeto params
    let params = new HttpParams();
    params = params.append('nombre', nombre);

    // asignacion de parametros
    return this.http.get(`${this.baseUrl}user`,{params:params});
  }
  verUsuarioCompleto()
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}user/completo`);
  }
  handleErrorUsuariosCompleto(error: any): any {
    return error=error.error.error;
  }
  handleUsuariosCompleto(data: IUsuarioCompleto[]):IUsuarioCompleto[] {
    let usuario:IUsuarioCompleto[]=data;
    return usuario
  }
  verusuarioCompleto(nombre:number)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}user/completo/`+nombre);
  }
  handleErrorUsuarioCompleto(error: any): any {
    return error=error.error.error;
  }
  handleUsuarioCompleto(data: IUsuarioCompleto):IUsuarioCompleto {
    let usuario:IUsuarioCompleto=data;
    return usuario
  }


  verusuario(nombre:string)
  {
    // asignacion de parametros
    return this.http.get(`${this.baseUrl}user/`+nombre);
  }
  handleError(error: any): any {
    return error=error.error.error;
  }
  handleusuario(data: IUsuario[]):IUsuario[] {
    let usuario:IUsuario[]=data;
    return usuario
  }
  verificarEmail(nombre:string)
  {
    // Inicializacion de objeto params
    let email:any={
      email: nombre,
    };
    let params = new HttpParams();
    params = params.append('email', nombre);
    this.token();
    // asignacion de parametros
    return this.http.post(`${this.baseUrl}auth/checkemail`,email,{headers:this.headers});
  }
//---------------------crear   usuario-------------------------------------------
crearusuario(data:IUsuario) {
  this.token();
  return this.http.post(`${this.baseUrl}user`,data, {headers:this.headers})
}
handleCrearusuarioError(error: any): any {
  return error=error;
}
handleCrearusuario(data: IUsuario):IUsuario {
  let usuario:IUsuario=data;
  return usuario
}
//---------------------Editar   usuario-------------------------------------------
editarusuario(data:any) {
  let { id, ...dataSinId } = data;
  console.log(dataSinId);
  this.token();
  return this.http.put(`${this.baseUrl}user/`+data.id, this.limpiarObjeto(dataSinId));
}
handleEditarusuarioError(error: any): any {
  return error=error;
}
handleEditarusuario(data: boolean):boolean {
  let usuario:boolean=data;
  return usuario
}
 limpiarObjeto = (obj: any) => 
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
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


