import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPermiso } from '@data/permisos.metadata';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private baseUrl = localStorage.getItem('url-backend');
  constructor(private http: HttpClient) { }

//-----------------Listado de Permission-------------------------------------------
  Permissions() {

    return this.http.get(`${this.baseUrl}/permisos`);
  }
  handlePermissions(data:IPermiso[]):IPermiso[]{
    let Permission:IPermiso[]=data;
    return Permission
  }
  handleErrorPermissions(error:any):any{
    let errorPermission=error;
    return errorPermission
  }
//-----------------Listado de Permission-------------------------------------------
//-----------------Ver de Permission-------------------------------------------
  verPermission(data:any)
  {
    return this.http.get(`${this.baseUrl}/permiso/`+data);
  }
  handleErrorPermission(error: any): any {
    return error=error.error.error;
  }
  handlePermission(data: IPermiso):IPermiso {
    let empleado:IPermiso=data;
    return empleado
  }
//-----------------Ver de Permission-------------------------------------------
 //-----------------Creacion de permiso -------------------------------------------
 crearPermission(data:IPermiso) {
  return this.http.post(`${this.baseUrl}/permiso`, data)
}
handleCrearPermissionError(error: any): any {
  return error=error;
}
handleCrearPermission(data: IPermiso):IPermiso {
  let permiso:IPermiso=data;
  return permiso
}
//-----------------Creacion de permiso --------------------------------------------
//---------------------Editar permiso-------------------------------------------
editarPermission(data:IPermiso) {
  return this.http.put(`${this.baseUrl}/permiso/`+data.id, data)
}
handleEditarPermissionError(error: any): any {
  return error=error;
}
handleEditarPermission(data: boolean):boolean {
  let permiso:boolean=data;
  return permiso
}
//---------------------Editar Permission-------------------------------------------
//---------------------Eliminar Permission-------------------------------------------
eliminarPermission(id:any) {
  return this.http.delete(`${this.baseUrl}/permiso/`+id)
}
handleEliminarPermissionError(error: any): any {
  return error=error;
}
handleEliminarPermission(data: boolean):boolean {
  let Permission:boolean=data;
  return Permission
}
//---------------------Eliminar Permission-------------------------------------------
}
