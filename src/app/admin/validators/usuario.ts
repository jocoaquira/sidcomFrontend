import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUsuario } from '@data/usuario.metadata';
import { passwordMatchValidator } from './igualar-password';

export class UsuarioFormulario {
  usuario!: IUsuario;
  formulario: FormGroup;

  constructor() {
    this.usuario = {
        id: null,
        email: null,
        email_verified_at:null,
        nombre:null,
        apellidos:null,
        ci:null,
        celular:null,
        rol_id:null,
        operador_id:null,
        estado:null,
        created_at:null,
        updated_at:null,
        pass_gen:null,
        password:null,
        repetir_password:null,
    };

    this.formulario = new FormGroup({
        id:new FormControl(this.usuario.id),
        email: new FormControl(this.usuario.email,[Validators.required,  Validators.email]),
        nombre:new FormControl(this.usuario.nombre,[Validators.required,Validators.pattern('^[a-zA-Z�-�\\u00d1\\u00f1\\s]+$')]),
        apellidos:new FormControl(this.usuario.apellidos,[Validators.required, Validators.pattern('^[a-zA-Z�-�\\u00d1\\u00f1\\s]+$')]),
        ci:new FormControl(this.usuario.ci,[Validators.required]),
        celular:new FormControl(this.usuario.celular,[Validators.required,Validators.pattern('^[0-9]{8}$')]),
        rol_id:new FormControl(this.usuario.rol_id,[Validators.required]),
        operador_id:new FormControl(this.usuario.operador_id),
        estado:new FormControl(this.usuario.estado,[Validators.required]),
        pass_gen:new FormControl(this.usuario.pass_gen),
        password:new FormControl(this.usuario.password,[Validators.minLength(8)]),
        repetir_password:new FormControl(this.usuario.repetir_password)
    },
    [passwordMatchValidator()]);
  }

  // Método general para obtener un FormControl
  getControl(controlName: string): FormControl | null {
    return this.formulario.get(controlName) as FormControl | null;
  }

  // Método general para verificar si un campo es inválido
  esCampoInvalido(controlName: string): boolean {
    const control = this.getControl(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

getErrorMessage(controlName: string): string | null {
    const control = this.formulario.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control?.hasError('email')) {
      return 'Debe ingresar un correo electrónico válido.';
    }

    if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength']?.requiredLength} caracteres.`;
    }
    if (control?.hasError('maxlength')) {
      return `No puede exceder ${control.errors?.['maxlength']?.requiredLength} caracteres.`;
    }
    if (control?.hasError('pattern')) {
        if (controlName === 'celular') {
            return 'Solo se permiten 8 dígitos numéricos.';
          }
          if (controlName === 'nombre') {
            return 'Solo se permiten letras y espacios.';
          }
          if (controlName === 'apellidos') {
            return 'Solo se permiten letras y espacios.';
          }
          return 'Formato no válido.';
      }
      if (control?.hasError('passwordMismatch')) {
        return 'Las contraseñas no coinciden.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}


