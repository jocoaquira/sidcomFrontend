import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';

const canPermiso='create-formulario-interno-101';

@Injectable({
  providedIn: 'root'
})
export class CanCrearFormularioInternoGuard implements CanActivate {
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
