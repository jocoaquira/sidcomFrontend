import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatchValidator } from './igualar-password';
import { IResponsableSenarecom } from '@data/responsable_senarecom_tm.metadata';

export class ResponsableSenarecomFormulario {
  responsable_senarecom!: IResponsableSenarecom;
  formulario: FormGroup;

  constructor() {
    this.responsable_senarecom = {
        id: null,
        email: null,
        nombre:null,
        apellidos:null,
        ci:null,
        celular:null,
        cargo:null,
        estado:null,
        created_at:null,
        updated_at:null,
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.responsable_senarecom.id),
        email: new FormControl(this.responsable_senarecom.email,[Validators.required,  Validators.email]),
        nombre:new FormControl(this.responsable_senarecom.nombre,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
        apellidos:new FormControl(this.responsable_senarecom.apellidos,[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
        ci:new FormControl(this.responsable_senarecom.ci,[Validators.required]),
        celular:new FormControl(this.responsable_senarecom.celular,[Validators.required,Validators.pattern('^[0-9]{8}$')]),
        cargo: new FormControl(this.responsable_senarecom.cargo, [
          Validators.required, 
          Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s]+$')
        ]),
        estado:new FormControl(this.responsable_senarecom.estado,[Validators.required])
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
          if (controlName === 'cargo') {
            return 'Solo se permiten letras numeros y espacios.';
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
