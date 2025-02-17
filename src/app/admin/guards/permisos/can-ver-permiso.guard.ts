import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';
const canVerRol='view_permission';
@Injectable({
  providedIn: 'root'
})
export class CanVerPermisoGuard implements CanActivate {

  constructor(
    private router:Router,
    private permissionHelperService:PermissionHelperService,
  ){}
  public canActivate(
  ):boolean{
    if(this.permissionHelperService.existeUsuarioPermisos()){
      return this.permissionHelperService.existePermiso(canVerRol);
    }
    this.router.navigate(['auth']);
    return false;
  }

}
