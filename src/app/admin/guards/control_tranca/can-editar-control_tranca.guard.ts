import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { PermissionHelperService } from '../../helpers/permission.helper.service';
const canEditar='update_control_tranca';

@Injectable({
  providedIn: 'root'
})
export class CanEditarcontrolTrancaGuard implements CanActivate {
  constructor(
    private router:Router,
    private permissionHelperService:PermissionHelperService,
  ){}
  public canActivate(
  ):boolean{
    if(this.permissionHelperService.existeUsuarioPermisos()){
      return this.permissionHelperService.existePermiso(canEditar);
    }
    this.router.navigate(['auth']);
    return false;
  }

}
