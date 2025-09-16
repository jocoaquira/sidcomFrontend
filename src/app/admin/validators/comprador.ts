import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IComprador } from '@data/comprador.metadata';


export class CompradorFormulario {
  comprador!: IComprador;
  formulario: FormGroup;

  constructor() {
    this.comprador = {
        id: null,
        razon_social:null,
        latitud:null,
        longitud:null,
        municipio_id:null,
        estado:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.comprador.id),
        razon_social:new FormControl(this.comprador.razon_social,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s(),]+$')]),
        latitud:new FormControl(this.comprador.latitud,[Validators.required]),
        longitud:new FormControl(this.comprador.longitud,[Validators.required]),
        municipio_id:new FormControl(this.comprador.municipio_id,[Validators.required]),
        estado:new FormControl(this.comprador.estado),
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
          if (controlName === 'razon_social') {
            return 'Solo se permiten letras, espacios, parentecis y comas.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
