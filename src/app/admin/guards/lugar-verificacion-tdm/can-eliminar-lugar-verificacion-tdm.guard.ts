import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';
const canEliminar='delete_lugar_verificacion_tdm';

@Injectable({
  providedIn: 'root'
})
export class CanEliminarLugarVerificacionTDMGuard implements CanActivate {
  constructor(
    private router:Router,
    private permissionHelperService:PermissionHelperService,
  ){}
  public canActivate(
  ):boolean{
    if(this.permissionHelperService.existeUsuarioPermisos()){
      return this.permissionHelperService.existePermiso(canEliminar);
    }
    this.router.navigate(['auth']);
    return false;
  }


}
