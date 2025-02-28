import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MustChangePasswordGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const mustChangePassword = localStorage.getItem('mustChangePassword') === 'true';

    if (mustChangePassword) {
      this.router.navigate(['/auth/cambiar-password']);
      return false;
    }
    return true;
  }
}