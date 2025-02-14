import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatchValidator } from './igualar-password';
import { IPais } from '@data/pais.metadata';

export class PaisFormulario {
  pais!: IPais;
  formulario: FormGroup;

  constructor() {
    this.pais = {
        id: null,
        nombre:null,
        sigla:null,
        continente:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.pais.id),
        nombre:new FormControl(this.pais.nombre,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        sigla:new FormControl(this.pais.sigla,[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        continente: new FormControl(this.pais.continente),
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
          if (controlName === 'sigla') {
            return 'Solo se permiten letras, espacios, parentecis y comas.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
