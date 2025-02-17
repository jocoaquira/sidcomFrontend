import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';

const canPermiso='create_procedure';

@Injectable({
  providedIn: 'root'
})
export class CanCrearProcedimientoGuard implements CanActivate {
  constructor(
    private router:Router,
    private permissionHelperService:PermissionHelperService,
  ){}
  public canActivate(
  ):boolean{
    if(this.permissionHelperService.existeUsuarioPermisos()){
      return this.permissionHelperService.existePermiso(canPermiso);
    }
    this.router.navigate(['auth']);
    return false;
  }

}
