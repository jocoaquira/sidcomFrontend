import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatchValidator } from './igualar-password';
import { IMineral } from '@data/mineral.metadata';

export class MineralFormulario {
  mineral!: IMineral;
  formulario: FormGroup;

  constructor() {
    this.mineral = {
        id: null,
        nombre:null,
        sigla:null,
        descripcion:null,
        tipo:null,
        estado:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.mineral.id),
        nombre:new FormControl(this.mineral.nombre,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        sigla:new FormControl(this.mineral.sigla,[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        descripcion:new FormControl(this.mineral.descripcion),
        tipo:new FormControl(this.mineral.tipo,[Validators.required]),
        estado:new FormControl(this.mineral.estado,[Validators.required])
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
