import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const repetirPassword = control.get('repetir_password');

    if (password && repetirPassword && password.value !== repetirPassword.value) {
      return { passwordMismatch: true }; // Retorna un error si no coinciden
    }
    return null; // Si coinciden, no hay error
  };
}
