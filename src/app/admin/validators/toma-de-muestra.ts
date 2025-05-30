import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ITomaDeMuestra } from '@data/toma_de_muestra.metadata';

export class TomaDeMuestraFormulario {
  form_toma_de_muestra!: ITomaDeMuestra;
  formulario: FormGroup;

  constructor() {
     this.form_toma_de_muestra={
        id:0,
        user_id:0,//
        operador_id:0,//
        responsable_tdm_id:null,
        responsable_tdm_senarecom_id:0,
        responsable_tdm_gador_id:0,
        nro_formulario:null,
        lugar_verificacion:null,
        ubicacion_lat:null,
        ubicacion_lon:null,
        municipio_id:null,
        lote:null,//
        presentacion_id:null,//
        cantidad:0,//
        nro_camiones:0,
        humedad:0,
        nro_parciales:0,
        total_parcial:0,
        peso_neto_total:0,
        peso_neto_parcial:0,
        departamento_id:null,
        tipo_muestra:null,
        observaciones: null,
        fecha_hora_tdm:null,
        fecha_creacion: null,
        fecha_modificacion:null,
        fecha_aprobacion: null,
        fecha_firma:null,
        justificacion_anulacion: null,
        estado:null
    }
    this.formulario = new FormGroup({
        user_id:new FormControl(this.form_toma_de_muestra.user_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        operador_id:new FormControl(this.form_toma_de_muestra.operador_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        responsable_tdm_id:new FormControl(this.form_toma_de_muestra.responsable_tdm_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        responsable_tdm_senarecom_id:new FormControl(this.form_toma_de_muestra.responsable_tdm_senarecom_id,[Validators.pattern('^[0-9]*$')]),
        responsable_tdm_gador_id:new FormControl(this.form_toma_de_muestra.responsable_tdm_gador_id,[Validators.pattern('^[0-9]*$')]),
        municipio_id:new FormControl(this.form_toma_de_muestra.municipio_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        departamento_id:new FormControl(this.form_toma_de_muestra.departamento_id,[Validators.required,Validators.pattern('^[0-9]*$')]),

        lote:new FormControl(this.form_toma_de_muestra.lote,[Validators.required]),
        presentacion_id:new FormControl(this.form_toma_de_muestra.presentacion_id,[Validators.required]),
        cantidad:new FormControl(this.form_toma_de_muestra.cantidad,[Validators.pattern('^[0-9]*$'),  Validators.min(0)]),
        nro_camiones:new FormControl(this.form_toma_de_muestra.nro_camiones,[Validators.pattern('^[0-9]*$'),  Validators.min(1)]),
        humedad:new FormControl(this.form_toma_de_muestra.humedad,[Validators.pattern('^\\d+(\\.\\d+)?$'),  Validators.min(0),Validators.max(25)]),
        total_parcial:new FormControl(this.form_toma_de_muestra.total_parcial,[Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)]),
        peso_neto_total: new FormControl(this.form_toma_de_muestra.peso_neto_total,[Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(1)]),
        peso_neto_parcial: new FormControl(this.form_toma_de_muestra.peso_neto_parcial,[Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)]),
        ubicacion_lat:new FormControl(this.form_toma_de_muestra.ubicacion_lat,[Validators.required,Validators.pattern('^-?\\d+(\\.\\d+)?$')]),
        ubicacion_lon:new FormControl(this.form_toma_de_muestra.ubicacion_lon,[Validators.required,Validators.pattern('^-?\\d+(\\.\\d+)?$')]),
        lugar_verificacion: new FormControl(this.form_toma_de_muestra.lugar_verificacion,[Validators.required]),
        tipo_muestra:new FormControl(this.form_toma_de_muestra.tipo_muestra),
        observaciones:new FormControl(this.form_toma_de_muestra.observaciones),
        fecha_creacion:new FormControl(this.form_toma_de_muestra.fecha_creacion),
        fecha_hora_tdm:new FormControl(this.form_toma_de_muestra.fecha_hora_tdm,[Validators.required,this.fechaNoAnteriorAHoy]),
        justificacion_anulacion:new FormControl(this.form_toma_de_muestra.justificacion_anulacion),
       fecha_firma:new FormControl(this.form_toma_de_muestra.fecha_firma),
        fecha_aprobacion:new FormControl(this.form_toma_de_muestra.fecha_aprobacion),
        estado:new FormControl(this.form_toma_de_muestra.estado,[Validators.required]),
    });

  }

// Validador personalizado para que la fecha no sea anterior a hoy
fechaNoAnteriorAHoy(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const fechaIngresada = new Date(control.value);
  const ahora = new Date();
  // No seteamos las horas a 0, así compara fecha y hora exactas
  return fechaIngresada < ahora ? { fechaAnterior: true } : null;
}
  // Método general para obtener un FormControl
  getControl(controlName: null): FormControl | null {
    return this.formulario.get(controlName) as FormControl | null;
  }

  // Método general para verificar si un campo es inválido
  esCampoInvalido(controlName: null): boolean {
    const control = this.getControl(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

getErrorMessage(controlName: string): string | null {
    const control = this.formulario.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control?.hasError('min')) {
        return `El numero ingresado debe ser mayor.`;
      }
      if (control?.hasError('max')) {
        return `El número introducido debe ser menor.`;
      }
    if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength']?.requiredLength} caracteres.`;
    }
    if (control?.hasError('maxlength')) {
      return `No puede exceder ${control.errors?.['maxlength']?.requiredLength} caracteres.`;
    }
    if (control?.hasError('pattern')) {
          if (controlName === 'user_id') {
            return 'Solo se permiten numeros.';
          }
          if (controlName === 'operador_id') {
            return 'Solo se permiten numeros.';
          }
          if (controlName === 'peso_neto_total') {
            return 'Solo se permiten numeros usar punto (.) si tiene decimal.';
          }
          if (controlName === 'peso_neto_parcial') {
            return 'Solo se permiten numeros usar punto (.) si tiene decimal.';
          }
          if (controlName === 'ubicacion_lat') {
            return 'Solo se permiten numeros usar punto (.) si tiene decimal.';
          }
          if (controlName === 'ubicacion_lon') {
            return 'Solo se permiten numeros usar punto (.) si tiene decimal.';
          }
          if (controlName === 'lugar_verificacion') {
            return 'Solo se permiten numeros usar punto (.) si tiene decimal.';
          }
          if (controlName === 'cantidad') {
            return 'Solo se permiten numeros.';
          }
          if (controlName === 'humedad') {
            return 'Solo se permiten numeros.';
          }
          if (controlName === 'municipio_id') {
            return 'Solo se permiten numeros.';
          }
          return 'Formato no válido.';
      }
      if (control?.hasError('fechaAnterior')) {
        return 'La fecha no puede ser anterior a hoy.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
