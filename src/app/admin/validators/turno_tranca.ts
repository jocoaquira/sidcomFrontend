import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ITurnoTranca } from '@data/turno_tranca.metadata';


export class TurnoTrancaFormulario {
  turno_tranca!: ITurnoTranca;
  formulario: FormGroup;

  constructor() {
    this.turno_tranca = {
        id: null,
        fecha_inicio:null,
        fecha_fin:null,
        trancaId:null,
        usuarioId:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.turno_tranca.id),
        fecha_inicio:new FormControl(this.turno_tranca.fecha_inicio,[Validators.required]),
        fecha_fin:new FormControl(this.turno_tranca.fecha_fin,[Validators.required]),
        trancaId:new FormControl(this.turno_tranca.trancaId,[Validators.required]),
        usuarioId:new FormControl(this.turno_tranca.usuarioId,[Validators.required]),
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
          if (controlName === 'lugar') {
            return 'Solo se permiten letras, espacios, parentecis y comas.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
