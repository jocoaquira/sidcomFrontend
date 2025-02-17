import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';
const canEditarRol='update_role';

@Injectable({
  providedIn: 'root'
})
export class CanEditarRolGuard implements CanActivate {
  constructor(
    private router:Router,
    private permissionHelperService:PermissionHelperService,
  ){}
  public canActivate(
  ):boolean{
    if(this.permissionHelperService.existeUsuarioPermisos()){
      return this.permissionHelperService.existePermiso(canEditarRol);
    }
    this.router.navigate(['auth']);
    return false;
  }

}
