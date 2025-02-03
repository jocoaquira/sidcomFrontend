import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatchValidator } from './igualar-password';
import { IProcedimiento } from '@data/procedimiento_tm.metadata';

export class ProcedimientoFormulario {
  procedimiento!: IProcedimiento;
  formulario: FormGroup;

  constructor() {
    this.procedimiento = {
        id: null,
        nombre:null,
        procedimiento:null,
        estado:null,
        created_at:null,
        updated_at:null,
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.procedimiento.id),
        nombre:new FormControl(this.procedimiento.nombre,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
        procedimiento:new FormControl(this.procedimiento.procedimiento,[Validators.required]),
        estado:new FormControl(this.procedimiento.estado)
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
        
          if (controlName === 'nombre') {
            return 'Solo se permiten letras y espacios.';
          }
          if (controlName === 'procedimiento') {
            return 'Se requiere procedimiento.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
