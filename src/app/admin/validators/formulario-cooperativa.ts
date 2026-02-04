import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { ITipoTransporte } from '@data/tipo_transporte.metadata';
import { catchError, debounceTime, map, Observable, of } from 'rxjs';
import { TipoTransporteService } from '../services/tipo-transporte.service';

export class FormularioCooperativaFormulario {
  formulario_interno!: IFormularioInterno;
  formulario: FormGroup;

  constructor(
    private tipoTransporteService: TipoTransporteService
  ) {
     this.formulario_interno={
        id:null,
        user_id:null,
        operador_id:null,
        nro_formulario:null,
        lote:null,
        presentacion_id:null,
        cantidad:null,
        peso_bruto_humedo:0,
        peso_neto:0,
        tara:0,
        humedad:0,
        merma:0,
        des_tipo:'',
        des_comprador:null,
        des_planta: null,
        id_municipio_destino: null,
        tipo_transporte: null,
        placa: null,
        nom_conductor: null,
        licencia: null,
        observaciones: null,
        fecha_creacion: null,
        fecha_vencimiento: null,
        justificacion_anulacion: null,
        estado:null, //'GENERADO','EMITIDO','VENCIDO', 'ANULADO'
        nro_vagon:null,
        empresa_ferrea:null,
        fecha_ferrea:null,
        hr_ferrea:null,
        tara_volqueta:null,
        //copes
        traslado_mineral:null,
        nro_viajes:null
    }
    this.formulario = new FormGroup({
        user_id:new FormControl(this.formulario_interno.user_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        operador_id:new FormControl(this.formulario_interno.operador_id,[Validators.required,Validators.pattern('^[0-9]*$')]),
        lote:new FormControl(this.formulario_interno.lote,[Validators.required]),
        presentacion_id:new FormControl(this.formulario_interno.presentacion_id,[Validators.required]),
        cantidad:new FormControl(this.formulario_interno.cantidad,[Validators.pattern('^[0-9]*$'),  Validators.min(0)]),
        peso_bruto_humedo:new FormControl(this.formulario_interno.peso_bruto_humedo,[Validators.required,Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)]),

        // PESO_NETO con validador asíncrono personalizado
        peso_neto: new FormControl(
            this.formulario_interno.peso_neto,
            [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)],
            [this.validarPesoNetoSegunCapacidad.bind(this)] // Validador asíncrono
        ),
        tara:new FormControl(this.formulario_interno.tara),
        humedad: new FormControl(this.formulario_interno.humedad),
        merma:new FormControl(this.formulario_interno.merma),
        des_tipo: new FormControl(this.formulario_interno.des_tipo,[Validators.required]),
        des_comprador:new FormControl(this.formulario_interno.des_comprador),
        des_planta: new FormControl(this.formulario_interno.des_planta),
        id_municipio_destino:new FormControl(this.formulario_interno.id_municipio_destino,[Validators.pattern('^[0-9]*$')]),
        tipo_transporte:new FormControl(this.formulario_interno.tipo_transporte,[Validators.required]),
        placa:new FormControl(this.formulario_interno.placa),
        nom_conductor:new FormControl(this.formulario_interno.nom_conductor,Validators.pattern('^[a-zA-Z�-�\\u00d1\\u00f1\\s]+$')),
        licencia:new FormControl(this.formulario_interno.licencia),
        observaciones:new FormControl(this.formulario_interno.observaciones),
        fecha_creacion:new FormControl(this.formulario_interno.fecha_creacion),
        fecha_vencimiento:new FormControl(this.formulario_interno.fecha_vencimiento),
        justificacion_anulacion:new FormControl(this.formulario_interno.justificacion_anulacion),
        nro_vagon:new FormControl(this.formulario_interno.nro_vagon),
        empresa_ferrea:new FormControl(this.formulario_interno.empresa_ferrea),
        hr_ferrea:new FormControl(this.formulario_interno.hr_ferrea),
        fecha_ferrea:new FormControl(this.formulario_interno.fecha_ferrea),
        tara_volqueta:new FormControl(this.formulario_interno.tara_volqueta,[Validators.pattern('^[0-9]*$')]),
        traslado_mineral:new FormControl(this.formulario_interno.traslado_mineral,[Validators.required]),
        nro_viajes:new FormControl(this.formulario_interno.nro_viajes,[Validators.required,Validators.pattern('^[0-9]*$')]),
        estado:new FormControl(this.formulario_interno.estado,[Validators.required]),
    });
    // Observar cambios en `des_tipo`
        this.formulario.get('des_tipo')?.valueChanges.subscribe((valor: string) => {
        this.actualizarValidacionesSegunTipo(valor);
    });

    // Observar cambios en tipo_transporte para revalidar peso_neto
    this.formulario.get('tipo_transporte')?.valueChanges.subscribe(() => {
      this.formulario.get('peso_neto')?.updateValueAndValidity();
    });
  }

    /**
     * VALIDADOR ASÍNCRONO PERSONALIZADO
     * Valida que el peso_neto no exceda la capacidad del tipo de transporte seleccionado
     */
    private validarPesoNetoSegunCapacidad(control: AbstractControl): Observable<ValidationErrors | null> {
      if (!control.value || !this.formulario) {
        return of(null);
      }

      const tipoTransporteControl = this.formulario.get('tipo_transporte');
      const tipoTransporteId = tipoTransporteControl?.value;

      if (!tipoTransporteId) {
        // Si no hay tipo de transporte seleccionado, no validar aún
        return of(null);
      }

      const pesoNeto = parseFloat(control.value);

      if (isNaN(pesoNeto)) {
        return of(null); // Dejar que otros validadores manejen el formato
      }

      return this.tipoTransporteService.verTipoTransporteNombre(tipoTransporteId).pipe(
        debounceTime(300), // Evitar llamadas excesivas
        map((tipoTransporte: ITipoTransporte) => {
          console.log('Tipo de Transporte:', tipoTransporte);
          if (!tipoTransporte) {
            return { tipoTransporteNoEncontrado: true };
          }

          if (pesoNeto > tipoTransporte.capacidad) {
            return {
              pesoExcedeCapacidad: {
                pesoNeto: pesoNeto,
                capacidadMaxima: tipoTransporte.capacidad,
                tipoTransporte: tipoTransporte.nombre
              }
            };
          }

          return null; // Válido
        }),
        catchError(() => {
          // En caso de error en la consulta
          return of({ errorConsultaCapacidad: true });
        })
      );
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
    // VALIDACIONES PERSONALIZADAS DE PESO_NETO
    if (controlName === 'peso_neto') {
      if (control?.hasError('pesoExcedeCapacidad')) {
        const error = control.errors?.['pesoExcedeCapacidad'];
        return `El peso neto (${error.pesoNeto} kg) excede la capacidad máxima del ${error.tipoTransporte} (${error.capacidadMaxima} kg)`;
      }
      if (control?.hasError('tipoTransporteNoEncontrado')) {
        return 'No se pudo verificar la capacidad del tipo de transporte seleccionado.';
      }
      if (control?.hasError('errorConsultaCapacidad')) {
        return 'Error al consultar la capacidad del transporte. Intente nuevamente.';
      }
    }
    if (control?.hasError('pattern')) {
          if (controlName === 'user_id') {
            return 'Solo se permiten numeros.';
          }
          if (controlName === 'operador_id') {
            return 'Solo se permiten numeros.';
          }
          if (controlName === 'peso_neto') {
            return 'Solo se permiten numeros usar punto (.) si tiene decimal.';
          }
          if (controlName === 'peso_bruto_humedo') {
            return 'Solo se permiten numeros usar punto (.) si tiene decimal.';
          }

          if (controlName === 'cantidad') {
            return 'Solo se permiten numeros.';
          }
          if (controlName === 'id_municipio_destino') {
            return 'Solo se permiten numeros.';
          }
          if (controlName === 'nom_conductor') {
            return 'Solo se permiten letras.';
          }
          return 'Formato no válido.';
      }
    // Otros errores personalizados aquí si son necesarios
    return null;
  }

  private actualizarValidacionesSegunTipo(valor: string): void {

    const desComprador = this.formulario.get('des_comprador');
    const desPlanta = this.formulario.get('des_planta');
    const DestinoMunicipioId=this.formulario.get('id_municipio_destino');

    if (valor === 'COMPRADOR') {
      // Activar y hacer requerido `des_comprador`
      desComprador?.enable();
    //  desComprador?.setValidators([Validators.required]);
      desComprador?.updateValueAndValidity();
        DestinoMunicipioId?.clearValidators();
      // Deshabilitar y limpiar validaciones de `des_planta`
      desPlanta?.disable();
      desPlanta?.clearValidators();
      desPlanta?.updateValueAndValidity();
    } else if (valor === 'PLANTA DE TRATAMIENTO') {
      // Activar y hacer requerido `des_planta`
      desPlanta?.enable();
      desPlanta?.setValidators([Validators.required]);
      DestinoMunicipioId?.setValidators([Validators.required,Validators.pattern('^[0-9]*$')]);
      desPlanta?.updateValueAndValidity();

      // Deshabilitar y limpiar validaciones de `des_comprador`
      desComprador?.disable();
      desComprador?.clearValidators();
      desComprador?.updateValueAndValidity();
    } else {
      // Si no se selecciona ninguno, deshabilitar ambos
      desComprador?.disable();
      desComprador?.clearValidators();
      desComprador?.updateValueAndValidity();

      desPlanta?.disable();
      desPlanta?.clearValidators();
      desPlanta?.updateValueAndValidity();
    }
  }

}


