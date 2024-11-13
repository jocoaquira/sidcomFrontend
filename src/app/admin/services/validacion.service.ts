import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // Método para generar JSON de errores de un formulario
  getFormValidationErrors(form: FormGroup): any {
    const errorMessages: { [key: string]: any } = {};

    Object.keys(form.controls).forEach(controlName => {
      const controlErrors: ValidationErrors | null = form.get(controlName)?.errors;
      if (controlErrors) {
        errorMessages[controlName] = [];
        Object.keys(controlErrors).forEach(keyError => {
          let errorMessage = this.getErrorMessage(controlName, keyError, controlErrors[keyError]);
          errorMessages[controlName].push(errorMessage);
        });
      }
    });

    return errorMessages;
  }

  // Método para obtener un mensaje de error personalizado
  private getErrorMessage(controlName: string, errorType: string, errorValue: any): string {
    const messages: { [key: string]: string } = {
      required: `${controlName} es obligatorio`,
      minlength: `${controlName} debe tener al menos ${errorValue.requiredLength} caracteres`,
      maxlength: `${controlName} no debe exceder ${errorValue.requiredLength} caracteres`,
      email: `Formato de correo inválido`,
      customLength: `${controlName} debe tener al menos ${errorValue.requiredLength} caracteres`,
      negativePrice: `El precio debe ser positivo`,
      invalidQuantity: `La cantidad debe estar entre 1 y 100`,
      soloLetrasYEspacios: `Solo se permiten letras y espacios en ${controlName}`,
      // Añadir más mensajes de error personalizados aquí
    };

    return messages[errorType] || `${controlName} tiene un error no especificado`;
  }
  static soloLetrasYEspaciosValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      const isValid = soloLetrasYEspacios.test(control.value);
      return isValid ? null : { soloLetrasYEspacios: { valid: false, message: 'Solo se permiten letras y espacios' } };
    };
  }
}
