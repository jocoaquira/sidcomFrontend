import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router:Router,
    private authService:AuthService
  ){}
  canActivate(
    next:ActivatedRouteSnapshot,
    state:RouterStateSnapshot
  ):boolean{
    const currentUser= this.authService.getUser;
    if(JSON.stringify(currentUser)!=='{}' && currentUser){
      return true;
    }
    this.router.navigate(['auth'],{
      queryParams:{returnUrl:state.url}
    });
    return false;
  }

}
