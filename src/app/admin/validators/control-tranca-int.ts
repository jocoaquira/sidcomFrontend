import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IControlTranca } from '@data/control_tranca.metadata';


export class ControlTrancaFormulario {
  control_tranca!: IControlTranca;
  formulario: FormGroup;

  constructor() {
    this.control_tranca = {
        id: null,
        usuario_id:null,
        tranca_id:null,
        formint_id:null,
        fecha_inspeccion:null,
        observaciones:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.control_tranca.id),
        usuario_id:new FormControl(this.control_tranca.usuario_id,[Validators.required]),
        tranca_id:new FormControl(this.control_tranca.tranca_id,[Validators.required]),
        formint_id:new FormControl(this.control_tranca.formint_id,[Validators.required]),
        fecha_inspeccion:new FormControl(this.control_tranca.fecha_inspeccion,[Validators.required]),
        observaciones:new FormControl(this.control_tranca.observaciones),
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
