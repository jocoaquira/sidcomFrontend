import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';

const canCrearRol='create_permission';

@Injectable({
  providedIn: 'root'
})
export class CanCrearPermisoGuard implements CanActivate {
  constructor(
    private router:Router,
    private permissionHelperService:PermissionHelperService,
  ){}
  public canActivate(
  ):boolean{
    if(this.permissionHelperService.existeUsuarioPermisos()){
      return this.permissionHelperService.existePermiso(canCrearRol);
    }
    this.router.navigate(['auth']);
    return false;
  }

}
