import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IVehiculo } from '@data/vehiculo.metadata';


export class VehiculoFormulario {
  vehiculo!: IVehiculo;
  formulario: FormGroup;

  constructor() {
    this.vehiculo = {
        id: null,
        placa: null,
        tipo:null,
        operador_id:null,
        estado:null,
        created_at:null,
        updated_at:null,
    };

    this.formulario = new FormGroup({
        placa: new FormControl(this.vehiculo.placa, [
            Validators.required,
            Validators.pattern('^[0-9A-Za-z-]+$') // Acepta números, letras y guiones
        ]),
        tipo:new FormControl(this.vehiculo.tipo,[Validators.required]),
        operador_id:new FormControl(this.vehiculo.operador_id,[Validators.required]),
        id:new FormControl(this.vehiculo.id),
        estado:new FormControl(this.vehiculo.estado,[Validators.required])
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
          if (controlName === 'placa') {
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
