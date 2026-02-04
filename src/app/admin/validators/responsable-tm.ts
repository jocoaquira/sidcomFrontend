import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IResponsableTM } from '@data/responsable_tm.metadata';

export class ResponsableTMFormulario {
  usuario!: IResponsableTM;
  formulario: FormGroup;

  constructor() {
    this.usuario = {
        id: null,
        email: null,
        nombre:null,
        apellidos:null,
        ci:null,
        celular:null,
        operador_id:null,
        estado:null,
        created_at:null,
        updated_at:null,
    };

    this.formulario = new FormGroup({
        email: new FormControl(this.usuario.email,[Validators.email]),
        nombre:new FormControl(this.usuario.nombre,[Validators.required,Validators.pattern('^[a-zA-Z�-�\\u00d1\\u00f1\\s]+$')]),
        apellidos:new FormControl(this.usuario.apellidos,[Validators.required, Validators.pattern('^[a-zA-Z�-�\\u00d1\\u00f1\\s]+$')]),
        ci:new FormControl(this.usuario.ci,[Validators.required]),
        celular:new FormControl(this.usuario.celular,[Validators.required,Validators.pattern('^[0-9]{8}$')]),
        operador_id:new FormControl(this.usuario.operador_id,[Validators.required]),
        id:new FormControl(this.usuario.id),
        estado:new FormControl(this.usuario.estado,[Validators.required])
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
    if (control?.hasError('email')) {
      return 'Debe ingresar un correo electrónico válido.';
    }

    if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength']?.requiredLength} caracteres.`;
    }
    if (control?.hasError('maxlength')) {
      return `No puede exceder ${control.errors?.['maxlength']?.requiredLength} caracteres.`;
    }
    if (control?.hasError('pattern')) {
        if (controlName === 'celular') {
            return 'Solo se permiten 8 dígitos numéricos.';
          }
          if (controlName === 'nombre') {
            return 'Solo se permiten letras y espacios.';
          }
          if (controlName === 'apellidos') {
            return 'Solo se permiten letras y espacios.';
          }
          return 'Formato no válido.';
      }
      if (control?.hasError('passwordMismatch')) {
        return 'Las contraseñas no coinciden.';
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



