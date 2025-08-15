import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ITipoTransporte } from '@data/tipo_transporte.metadata';


export class TipoTransporteFormulario {
  tipo_transporte!: ITipoTransporte;
  formulario: FormGroup;

  constructor() {
    this.tipo_transporte = {
        id: null,
        nombre: null,
        capacidad:null,
        created_at:null,
        updated_at:null,
    };

    this.formulario = new FormGroup({
        capacidad: new FormControl(this.tipo_transporte.capacidad,[Validators.required]),
        nombre: new FormControl(this.tipo_transporte.nombre, [
            Validators.required,
            Validators.pattern('^[0-9A-Za-z-\\s]+$')// Acepta números, letras, guiones y espacios
        ]),
        id:new FormControl(this.tipo_transporte.id),
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
        if (controlName === 'tipo') {
            return 'Solo se permiten 8 dígitos numéricos.';
          }
          if (controlName === 'nombre') {
            return 'Solo se permiten letras, numeros y guiones (-).';
          }
          return 'Formato no válido.';
      }

    // Otros errores personalizados aquí si son necesarios
    return null;
  }
  mostrarErrores() {
    const errores: { [key: string]: string } = {};

    this.getControlNames().forEach((controlName) => {
      if (this.esCampoInvalido(controlName)) {
        errores[controlName] = this.getErrorMessage(controlName) || 'Error desconocido';
      }
    });


  }
  getControlNames(): string[] {
    return Object.keys(this.formulario.controls);
  }

}
