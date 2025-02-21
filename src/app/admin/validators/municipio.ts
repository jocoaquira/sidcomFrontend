import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMunicipio } from '@data/municipio.metadata';

export class MunicipioFormulario {
  municipio!: IMunicipio;
  formulario: FormGroup;

  constructor() {
    this.municipio = {
        id: null,
        codigo:null,
        municipio:null,
        provincia:null,
        departamento_id:null,
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.municipio.id),
        codigo:new FormControl(this.municipio.codigo,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        municipio:new FormControl(this.municipio.municipio,[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        provincia:new FormControl(this.municipio.provincia,[Validators.required]),
        departamento_id:new FormControl(this.municipio.departamento_id,[Validators.required])
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
          if (controlName === 'codigo') {
            return 'Solo se permiten letras, espacios, parentecis y comas.';
          }
          if (controlName === 'municipio') {
            return 'Solo se permiten letras, espacios, parentecis y comas.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
