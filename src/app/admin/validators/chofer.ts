import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IChofer } from '@data/chofer.metadata';

export class ChoferFormulario {
  usuario!: IChofer;
  formulario: FormGroup;

  constructor() {
    this.usuario = {
      id: null,
      nombre_apellidos: null,
      nro_licencia: null,
      operador_id: null,
      estado: null,
      created_at: null,
      updated_at: null,
    };

    this.formulario = new FormGroup({
      nro_licencia: new FormControl(this.usuario.nro_licencia, [Validators.required]),
      nombre_apellidos: new FormControl(
        this.usuario.nombre_apellidos,
        [Validators.required, Validators.pattern('^[a-zA-ZÇ?-Ç¨\\s]+$')]
      ),
      operador_id: new FormControl(this.usuario.operador_id, [Validators.required]),
      id: new FormControl(this.usuario.id),
      estado: new FormControl(this.usuario.estado, [Validators.required]),
    });
  }

  // Metodo general para obtener un FormControl
  getControl(controlName: string): FormControl | null {
    return this.formulario.get(controlName) as FormControl | null;
  }

  // Metodo general para verificar si un campo es invalido
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
      if (controlName === 'nombre_apellidos') {
        return 'Solo se permiten letras y espacios.';
      }
      if (controlName === 'apellidos') {
        return 'Solo se permiten letras y espacios.';
      }
      return 'Formato no valido.';
    }

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
