import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';
const canVerRol='ver_rol';
@Injectable({
  providedIn: 'root'
})
export class CanVerRolGuard implements CanActivate {

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
