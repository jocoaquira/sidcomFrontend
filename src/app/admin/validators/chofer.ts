import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IChofer } from '@data/chofer.metadata';

export class ChoferFormulario {
  usuario!: IChofer;
  formulario: FormGroup;

  constructor() {
    this.usuario = {
        id: null,
        nombre_apellidos: null,
        nro_licencia:null,
        celular:null,
        fecha_vencimiento:null,
        categoria:null,
        fecha_nacimiento:null,
        operador_id:null,
        estado:null,
        created_at:null,
        updated_at:null,
    };

    this.formulario = new FormGroup({
        nro_licencia: new FormControl(this.usuario.nro_licencia,[Validators.required]),
        nombre_apellidos:new FormControl(this.usuario.nombre_apellidos,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
        fecha_vencimiento:new FormControl(this.usuario.fecha_vencimiento,[Validators.required]),
        celular:new FormControl(this.usuario.celular,[Validators.required,Validators.pattern('^[0-9]{8}$')]),
        operador_id:new FormControl(this.usuario.operador_id,[Validators.required]),
        fecha_nacimiento:new FormControl(this.usuario.fecha_nacimiento),
        categoria:new FormControl(this.usuario.categoria),
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
          if (controlName === 'nombre_apellidos') {
            return 'Solo se permiten letras y espacios.';
          }
          if (controlName === 'apellidos') {
            return 'Solo se permiten letras y espacios.';
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
