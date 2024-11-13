import { Injectable } from '@angular/core';
import { AuthService } from '@core/authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionHelperService {

constructor(
  private authService:AuthService,
) { }
public existePermiso(canVerEmpleado:string):boolean{
  let permissions=this.authService.getUser.permissions;
  let sw=false;
  if(permissions)
  {
    permissions.forEach(element => {
      if(element.name==canVerEmpleado)
      {
        sw=true;
      }
    });
  }
  return sw;
}
public existeUsuarioPermisos():boolean{
  const currentUser= this.authService.getUser;
  if(currentUser)
  {
    if(JSON.stringify(currentUser.permissions)!=='{}'){
      return true;
    }
  }
  return false;
}
}
