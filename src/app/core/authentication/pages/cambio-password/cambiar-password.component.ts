import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { UsuariosService } from 'src/app/admin/services/usuarios.service';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss']
})
export class CambiarPasswordComponent {
  passwordForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorPass: string | null = null;
  errorVerificarPassword: boolean = false;
  usuario: any;  // Definir la estructura de tu usuario, si es necesario.
  @Output() estadoDialogo = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuariosService,
    private authService:AuthService
) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
    this.usuario = {
      id: authService.getUser.id,
      password: ''
    };
  }

  // Función para verificar si la contraseña repetida es igual a la original
  verificar(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (this.passwordForm.get('password')?.value === input) {
      this.errorVerificarPassword = false;
    } else {
      this.errorVerificarPassword = true;
    }
  }

  // Función de validación de la contraseña
  validarPassword() {
    const password = this.passwordForm.get('password')?.value;

    // Longitud mínima de 8 caracteres
    if (password.length < 8) {
      this.errorPass = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    // Al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      this.errorPass = 'La contraseña debe contener al menos una letra mayúscula.';
      return;
    }

    // Al menos un número
    if (!/[0-9]/.test(password)) {
      this.errorPass = 'La contraseña debe contener al menos un número.';
      return;
    }

    // No debe contener el nombre de usuario
    if (this.usuario.nombre && password.toLowerCase().includes(this.usuario.nombre.toLowerCase())) {
      this.errorPass = 'La contraseña no puede contener el nombre de usuario.';
      return;
    }

    // Si pasa todas las validaciones, limpiar el error
    this.errorPass = null;
  }

  // Función para actualizar el usuario con la nueva contraseña
  actualizarUsuario() {
    if (this.errorPass === null && !this.errorVerificarPassword) {
      const datos = {
        id: this.usuario.id,
        password: this.passwordForm.get('password')?.value
      };
      this.usuarioService.editarusuario(datos).subscribe(
        (data: any) => {
          if (data.error == null) {
            this.estadoDialogo.emit(false);
            alert('Se cambió la contraseña exitosamente');
            this.authService.logout();
          }
        },
        (error: any) => {
          alert('Error al cambiar la contraseña, por favor intente nuevamente');
        }
      );
    } else {
      alert('Revise los datos e intente nuevamente');
    }
  }

  // Función para cambiar la visibilidad de las contraseñas
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Cambiar la contraseña (ya implementada)
  cambiarPassword() {
    if (this.passwordForm.invalid) return;

    const { password, confirmPassword } = this.passwordForm.value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Aquí puedes llamar a tu backend para cambiar la contraseña
    alert('Contraseña cambiada con éxito.');
    localStorage.removeItem('mustChangePassword');
    this.router.navigate(['/auth']);
  }
}
