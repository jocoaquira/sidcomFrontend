import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';
const canVer='view_lugar_verificacion_tdm_id';
@Injectable({
  providedIn: 'root'
})
export class CanVerLugarVerificacionTDMGuard implements CanActivate {

  constructor(
    private router:Router,
    private permissionHelperService:PermissionHelperService,
  ){}
  public canActivate(
  ):boolean{
    if(this.permissionHelperService.existeUsuarioPermisos()){
      return this.permissionHelperService.existePermiso(canVer);
    }
    this.router.navigate(['auth']);
    return false;
  }

}
