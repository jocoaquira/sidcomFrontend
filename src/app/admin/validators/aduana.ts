import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatchValidator } from './igualar-password';
import { IAduana } from '@data/aduana.metadata';

export class AduanaFormulario {
  aduana!: IAduana;
  formulario: FormGroup;

  constructor() {
    this.aduana = {
        id: null,
        nombre:null,
        codigo_aduana:null,
        latitud:null,
        longitud:null,
        estado:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.aduana.id),
        nombre:new FormControl(this.aduana.nombre,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        codigo_aduana:new FormControl(this.aduana.codigo_aduana,[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        latitud:new FormControl(this.aduana.latitud),
        longitud:new FormControl(this.aduana.longitud,[Validators.required]),
        estado:new FormControl(this.aduana.estado,[Validators.required])
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
            return 'Solo se permiten letras, espacios, parentecis y comas.';
          }
          if (controlName === 'codigo_aduana') {
            return 'Solo se permiten letras, espacios, parentecis y comas.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
