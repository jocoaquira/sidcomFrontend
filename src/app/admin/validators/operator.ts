import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IOperator } from '@data/operator.metadata';

export class OperatorFormulario {
  operator!: IOperator;
  formulario: FormGroup;
  fechaRegistro: Date = new Date();

  constructor() {
     this.operator={
        id:null,
        razon_social:null,
       act_ben_concentracion:null,
       act_comer_externa:null,
       act_comer_interna:null,
       act_exploracion:null,
       act_explotacion:null,
       act_fundicion:null,
       act_tostacion:null,
       act_calcinacion:null,
       act_industrializacion:null,
       act_refinacion:null,
       act_tras_colas:null,
        denominacion_area:null,
        dl_departamento_id:null,
        dl_direccion:null,
        dl_municipio_id:null,
        //dl_ubicacion:null,
        doc_creacion:null,
        fecha_exp_nim:null,
        fecha_exp_seprec:null,
        //municipio_origen:null,
        //nro_codigo_unico:null,
        //nro_cuadricula:null,
        nro_matricula_seprec:null,
        nro_nim:null,
        nro_personeria:null,
        nro_res_ministerial:null,
        nro_ruex:null,
        fecha_exp_ruex:null,
        correo_inst:null,
        ofi_lat:null,
        ofi_lon:null,
        fax_op_min:null,
        tel_fijo:null,
        celular:null,
        otro_celular:null,
        tipo_doc_creacion:null,
        //tipo_explotacion:null,
        tipo_operador:null,
        verif_cert_liberacion:null,
        nit:null,
        tipo_nim_niar:null,
        fecha_creacion:null,
        fecha_actualizacion:null,
        fecha_expiracion:null,
        estado:null,
        verificacion_toma_muestra:false,
        comercio_interno_coperativa:false,
        traslado_colas:false,
        transbordo:false,
        nit_link:null,
        nim_link:null,
        seprec_link:null,
        doc_explotacion_link:null,
        ruex_link:null,
        resolucion_min_fundind_link:null,
        personeria_juridica_link:null,
        doc_creacion_estatal_link:null,
        ci_link:null,
        rep_nombre_completo:null,
        rep_ci:null,
        rep_departamento_id:null,
        rep_municipio_id:null,
        rep_direccion:null,
        rep_telefono:null,
        rep_celular:null,
        rep_correo:null,
        observaciones:null,
        created_at: null,
        updated_at: null,

    }
    this.formulario = new FormGroup({
        razon_social:new FormControl(this.operator.razon_social,[Validators.required,Validators.minLength(5)]),
        dl_departamento_id:new FormControl(this.operator.dl_departamento_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        dl_municipio_id:new FormControl(this.operator.dl_municipio_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        fecha_exp_nim: new FormControl(this.operator.fecha_exp_nim, [
            Validators.required,
            this.fechaMayorIgualValidador(this.fechaRegistro)
          ]),
        nro_nim:new FormControl(this.operator.nro_nim,[Validators.required]),
        correo_inst: new FormControl(this.operator.correo_inst,[Validators.required,  Validators.email]),
        celular:new FormControl(this.operator.celular,[Validators.required,Validators.pattern('^[0-9]{8}$')]),
        otro_celular:new FormControl(this.operator.otro_celular,[Validators.pattern('^[0-9]{8}$')]),
        tel_fijo:new FormControl(this.operator.tel_fijo,[Validators.pattern('^[0-9]{7}$')]),
        tipo_operador:new FormControl(this.operator.tipo_operador,[Validators.required,Validators.pattern('^[0-9]*$')]),
        nit:new FormControl(this.operator.nit,[Validators.required,Validators.minLength(5),Validators.pattern('^[0-9]*$')]),
        tipo_nim_niar:new FormControl(this.operator.tipo_nim_niar,[Validators.required]),
        rep_nombre_completo:new FormControl(this.operator.rep_nombre_completo,[Validators.required,Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]),
        rep_ci:new FormControl(this.operator.rep_ci,[Validators.required]),
        rep_departamento_id:new FormControl(this.operator.rep_departamento_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        rep_municipio_id:new FormControl(this.operator.rep_municipio_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        rep_celular:new FormControl(this.operator.rep_celular,[Validators.required,Validators.pattern('^[0-9]{8}$')]),
        rep_telefono:new FormControl(this.operator.rep_telefono,[Validators.pattern('^[0-9]{7}$')]),
        rep_correo: new FormControl(this.operator.rep_correo,[Validators.required,  Validators.email]),
        estado:new FormControl(this.operator.estado,[Validators.required]),
        verificacion_toma_muestra:new FormControl(this.operator.verificacion_toma_muestra,[Validators.required]),
        comercio_interno_coperativa:new FormControl(false,[Validators.required]),
        traslado_colas:new FormControl(this.operator.traslado_colas,[Validators.required]),
        transbordo:new FormControl(this.operator.transbordo,[Validators.required]),
        dl_direccion:new FormControl(this.operator.dl_direccion,[Validators.required]),
        nro_personeria:new FormControl(this.operator.nro_personeria),
        nro_matricula_seprec:new FormControl(this.operator.nro_matricula_seprec),
        fecha_exp_seprec: new FormControl(this.operator.fecha_exp_seprec, [
            this.fechaMayorIgualValidador(this.fechaRegistro)
          ]),
        tipo_doc_creacion:new FormControl(this.operator.tipo_doc_creacion),
        doc_creacion:new FormControl(this.operator.doc_creacion),
        ofi_lat:new FormControl(this.operator.ofi_lat, [Validators.required]),
        ofi_lon:new FormControl(this.operator.ofi_lon, [Validators.required]),
        act_exploracion:new FormControl(false,[Validators.required]),
        act_comer_interna:new FormControl(false,[Validators.required]),
        act_tras_colas:new FormControl(false,[Validators.required]),
        act_ben_concentracion:new FormControl(false,[Validators.required]),
        act_refinacion:new FormControl(false,[Validators.required]),
        act_industrializacion:new FormControl(false,[Validators.required]),
        observaciones:new FormControl(this.operator.observaciones),
        act_comer_externa:new FormControl(false),
        act_explotacion:new FormControl(false),
        act_fundicion:new FormControl(false),
        rep_direccion:new FormControl(this.operator.rep_direccion,[Validators.required]),
        //dl_ubicacion:new FormControl(this.operator.dl_ubicacion),
        created_at:new FormControl(this.operator.created_at),
        updated_at:new FormControl(this.operator.updated_at),
        fecha_exp_ruex: new FormControl(this.operator.fecha_exp_ruex, [
            this.fechaMayorIgualValidador(this.fechaRegistro)
          ]),
        nro_ruex:new FormControl(this.operator.nro_ruex,[Validators.pattern('^[0-9]*$')]),
        verif_cert_liberacion:new FormControl(this.operator.verif_cert_liberacion),
        nro_res_ministerial:new FormControl(this.operator.nro_res_ministerial)
    });
  }
  // Validador personalizado para fechas
  fechaMayorIgualValidador(fechaMinima: Date) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Si no hay valor, no validar (deja que required se encargue)
      }

      const fechaIngresada = new Date(control.value);
      const fechaMin = new Date(fechaMinima);

      // Comparar solo fechas (sin hora)
      fechaIngresada.setHours(0, 0, 0, 0);
      fechaMin.setHours(0, 0, 0, 0);

      if (fechaIngresada < fechaMin) {
        return {
          fechaMinima: {
            fechaIngresada: control.value,
            fechaMinima: fechaMinima,
            message: `La fecha debe ser mayor o igual a ${fechaMin.toLocaleDateString()}`
          }
        };
      }

      return null;
    };
  }

    // Método para actualizar los validadores de fecha cuando cambie la fecha de registro
    private actualizarValidadoresFecha(): void {
        const camposFecha = ['fecha_exp_nim', 'fecha_exp_seprec', 'fecha_exp_ruex'];

        camposFecha.forEach(campo => {
          const control = this.formulario.get(campo);
          if (control) {
            const validadoresActuales = control.validator;
            // Mantener los validadores existentes y agregar el nuevo
            control.setValidators([
              validadoresActuales,
              this.fechaMayorIgualValidador(this.fechaRegistro)
            ]);
            control.updateValueAndValidity();
          }
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
    // Error de fecha mínima
    if (control?.hasError('fechaMinima')) {
        return control.errors?.['fechaMinima']?.message;
      }
    if (control?.hasError('pattern')) {
          if (controlName === 'celular') {
            return 'Solo se permiten 8 dígitos numéricos.';
          }
          if (controlName === 'telefono') {
            return 'Solo se permiten 7 dígitos numéricos.';
          }
          if (controlName === 'rep_celular') {
            return 'Solo se permiten 8 dígitos numéricos.';
          }
          if (controlName === 'rep_telefono') {
            return 'Solo se permiten 7 dígitos numéricos.';
          }
          if (controlName === 'rep_nombre_completo') {
            return 'Solo se permiten letras y espacios.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

}
