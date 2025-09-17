import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPlantaDeTratamiento } from '@data/planta_tratamiento.metadata';


export class PlantaDeTratamientoFormulario {
  planta_de_tratamiento!: IPlantaDeTratamiento;
  formulario: FormGroup;

  constructor() {
    this.planta_de_tratamiento = {
        id: null,
        nombre:null,
        direccion:null,
        latitud:null,
        longitud:null,
        municipioId:null,
        estado:null
    };

    this.formulario = new FormGroup({
        id: new FormControl(this.planta_de_tratamiento.id),
        nombre:new FormControl(this.planta_de_tratamiento.nombre,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ0-9\\s(),.#-]+$')]),
        latitud:new FormControl(this.planta_de_tratamiento.latitud,[Validators.required]),
        longitud:new FormControl(this.planta_de_tratamiento.longitud,[Validators.required]),
        municipioId:new FormControl(this.planta_de_tratamiento.municipioId,[Validators.required]),
        direccion:new FormControl(this.planta_de_tratamiento.direccion),
        estado:new FormControl(this.planta_de_tratamiento.estado),
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
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
