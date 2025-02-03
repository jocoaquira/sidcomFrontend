import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAprobarTM } from '@data/aprobar_tm.metadata';

export class AprobarTMFormulario {
  aprobarTM!: IAprobarTM;
  formulario: FormGroup;

  constructor() {
    this.aprobarTM = {
        id: null,
        responsable_tdm_senarecom_id:null,
        procedimiento:null,
        observaciones:null,
        estado:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.aprobarTM.id),
        responsable_tdm_senarecom_id:new FormControl(this.aprobarTM.responsable_tdm_senarecom_id,[Validators.required]),
        procedimiento:new FormControl(this.aprobarTM.procedimiento,[Validators.required]),
        estado:new FormControl(this.aprobarTM.estado),
        observaciones:new FormControl(this.aprobarTM.observaciones)
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
        
          if (controlName === 'responsable_tdm_senarecom_id') {
            return 'es necesario id de responsable SENARECOM';
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
