import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPermiso } from '@data/permisos.metadata';

export class PermisoFormulario {
  pais!: IPermiso;
  formulario: FormGroup;

  constructor() {
    this.pais = {
        id: null,
        name:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.pais.id),
        name: new FormControl(this.pais.name, [
          Validators.required,
          Validators.pattern('^[a-z0-9_]+$')  // Permite solo letras minúsculas, números y guion bajo (_)
        ])

    });
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

    if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength']?.requiredLength} caracteres.`;
    }
    if (control?.hasError('maxlength')) {
      return `No puede exceder ${control.errors?.['maxlength']?.requiredLength} caracteres.`;
    }
    if (control?.hasError('pattern')) {
          if (controlName === 'name') {
            return 'Solo se permiten letras minusculas, _ y numeros.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
