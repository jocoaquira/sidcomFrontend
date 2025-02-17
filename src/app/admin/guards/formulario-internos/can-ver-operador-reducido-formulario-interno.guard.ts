import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';
const canVer='view_formint_operator_reduced';
@Injectable({
  providedIn: 'root'
})
export class CanVerOperadorReducidoFormularioInternoGuard implements CanActivate {

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
