import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IFormularioExterno } from '@data/formulario_externo.metadata';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, takeUntil } from 'rxjs/operators';
import { CanCrearTomaDeMuestraGuard } from '../guards/toma-de-muestra/can-crear-toma-de-muestra.guard';
import { TipoTransporteService } from '../services/tipo-transporte.service';
import { ITipoTransporte } from '@data/tipo_transporte.metadata';

@Injectable()
export class FormularioExternoFormulario implements OnDestroy {
  formulario_externo!: IFormularioExterno;
  formulario: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private canCrearTomaDeMuestra: CanCrearTomaDeMuestraGuard,
    private tipoTransporteService: TipoTransporteService
) {
    this.inicializarFormulario();
    this.configurarValidacionDinamica();
  }

  private inicializarFormulario(): void {
    this.formulario_externo = {
      id: null,
      user_id: null,
      operador_id: null,
      nro_formulario: null,
      m03_id: null,
      nro_factura_exportacion: null,
      laboratorio: null,
      codigo_analisis: null,
      nro_formulario_tm: null,
      lote: null,
      presentacion_id: null,
      cantidad: null,
      peso_bruto_humedo: 0,
      peso_neto: 0,
      tara: 0,
      humedad: 0,
      merma: 0,
      comprador: null,
      aduana_id: null,
      pais_destino_id: null,
      tipo_transporte: null,
      placa: null,
      nom_conductor: null,
      licencia: null,
      observaciones: null,
      fecha_creacion: null,
      fecha_vencimiento: null,
      justificacion_anulacion: null,
      estado: null,
      nro_vagon: null,
      empresa_ferrea: null,
      fecha_ferrea: null,
      hr_ferrea: null,
      tara_volqueta: null,
    };

    this.formulario = new FormGroup({
      user_id: new FormControl(this.formulario_externo.user_id, [Validators.required, Validators.pattern('^[0-9]*$')]),
      operador_id: new FormControl(this.formulario_externo.operador_id, [Validators.required, Validators.pattern('^[0-9]*$')]),
      lote: new FormControl(this.formulario_externo.lote, [Validators.required]),
      presentacion_id: new FormControl(this.formulario_externo.presentacion_id, [Validators.required]),
      cantidad: new FormControl(this.formulario_externo.cantidad, [Validators.pattern('^[0-9]*$'), Validators.min(0)]),
      peso_bruto_humedo: new FormControl(this.formulario_externo.peso_bruto_humedo, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(1)]),

      // PESO_NETO con validador asíncrono personalizado
      peso_neto: new FormControl(
        this.formulario_externo.peso_neto,
        [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)],
        [this.validarPesoNetoSegunCapacidad.bind(this)] // Validador asíncrono
      ),
      tara: new FormControl(this.formulario_externo.tara, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)]),
      humedad: new FormControl(this.formulario_externo.humedad, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0), Validators.max(100)]),
      merma: new FormControl(this.formulario_externo.merma, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0), Validators.max(1)]),
      comprador: new FormControl(this.formulario_externo.comprador, [Validators.required]),
      aduana_id: new FormControl(this.formulario_externo.aduana_id),
      pais_destino_id: new FormControl(this.formulario_externo.pais_destino_id),
      m03_id: new FormControl(this.formulario_externo.m03_id, [Validators.required]),
      tipo_transporte: new FormControl(this.formulario_externo.tipo_transporte, [Validators.required]),

      // Campos que serán condicionales según el tipo de transporte
      placa: new FormControl(this.formulario_externo.placa),
      nom_conductor: new FormControl(this.formulario_externo.nom_conductor),
      licencia: new FormControl(this.formulario_externo.licencia),

      observaciones: new FormControl(this.formulario_externo.observaciones),
      fecha_creacion: new FormControl(this.formulario_externo.fecha_creacion),
      fecha_vencimiento: new FormControl(this.formulario_externo.fecha_vencimiento),
      justificacion_anulacion: new FormControl(this.formulario_externo.justificacion_anulacion),
      nro_vagon: new FormControl(this.formulario_externo.nro_vagon),
      empresa_ferrea: new FormControl(this.formulario_externo.empresa_ferrea),
      hr_ferrea: new FormControl(this.formulario_externo.hr_ferrea),
      fecha_ferrea: new FormControl(this.formulario_externo.fecha_ferrea),
      tara_volqueta: new FormControl(this.formulario_externo.tara_volqueta, [Validators.pattern('^[0-9]*$')]),
      nro_factura_exportacion: new FormControl(this.formulario_externo.nro_factura_exportacion, [Validators.required]),
      laboratorio: new FormControl(this.formulario_externo.laboratorio, [Validators.required]),
      estado: new FormControl(this.formulario_externo.estado, [Validators.required]),
      codigo_analisis: new FormControl(this.formulario_externo.codigo_analisis, [Validators.required]),
      nro_formulario_tm: new FormControl(
        this.formulario_externo.nro_formulario_tm,
        this.canCrearTomaDeMuestra.canActivate() ? [Validators.required] : null
      ),
    });

    // Suscribirse a los cambios del tipo de transporte
    this.formulario.get('tipo_transporte')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((tipoTransporteId: number) => {
      this.actualizarValidacionesSegunTipoTransporte(tipoTransporteId);
    });

    this.formulario.get('des_tipo')?.valueChanges.subscribe((valor: string) => {
      this.actualizarValidacionesSegunTipo(valor);
    });
  }

  /**
   * Actualiza las validaciones de placa, conductor y licencia según el tipo de transporte
   */
  private actualizarValidacionesSegunTipoTransporte(tipoTransporteId: number): void {
    if (!tipoTransporteId) {
      return;
    }

    // Obtener información del tipo de transporte
    this.tipoTransporteService.verTipoTransporteNombre(tipoTransporteId).pipe(
      takeUntil(this.destroy$),
      catchError(() => of(null))
    ).subscribe((tipoTransporte: ITipoTransporte | null) => {
      if (!tipoTransporte) {
        return;
      }

      const esViaFerrea = tipoTransporte.nombre.toLowerCase().includes('via ferrea');

      const esViaAerea = tipoTransporte.nombre.toLowerCase().includes('via aerea');

      // Si es vía férrea o aérea, no son obligatorios
      const noRequiereCamposVehiculo = esViaFerrea || esViaAerea;

      this.configurarValidacionesCamposVehiculo(noRequiereCamposVehiculo);
    });
  }

  /**
   * Configura las validaciones de los campos de vehículo (placa, conductor, licencia)
   */
  private configurarValidacionesCamposVehiculo(esOpcional: boolean): void {
    const placaControl = this.formulario.get('placa');
    const conductorControl = this.formulario.get('nom_conductor');
    const licenciaControl = this.formulario.get('licencia');

    if (esOpcional) {
      // Para vía férrea o aérea: campos opcionales
      placaControl?.clearValidators();
      conductorControl?.clearValidators();
      licenciaControl?.clearValidators();
    } else {
      // Para otros tipos de transporte: campos obligatorios
      placaControl?.setValidators([Validators.required]);
      conductorControl?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z�-�\\u00d1\\u00f1\\s]+$')]);
      licenciaControl?.setValidators([Validators.required]);
    }

    // Actualizar validez de los controles
    placaControl?.updateValueAndValidity();
    conductorControl?.updateValueAndValidity();
    licenciaControl?.updateValueAndValidity();
  }

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

  private configurarValidacionDinamica(): void {
    // Como tu guard actual no expone un observable, usamos el estado inicial
    const puedeCrear = this.canCrearTomaDeMuestra.canActivate();
    this.actualizarValidacionCampoTm(puedeCrear);

    // Si necesitas reactividad, considera modificar el guard como se mostró anteriormente
  }

  private actualizarValidacionCampoTm(puedeCrear: boolean): void {
    const control = this.formulario.get('nro_formulario_tm');

    if (puedeCrear) {
      control?.setValidators([Validators.required]);
      control?.enable();
    } else {
      control?.clearValidators();
      control?.disable();
      control?.reset();
    }

    control?.updateValueAndValidity();
  }

  getControl(controlName: string): AbstractControl | null {
    return this.formulario.get(controlName);
  }

  esCampoInvalido(controlName: string): boolean {
    const control = this.getControl(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.formulario.get(controlName);

    if (control?.hasError('required')) {
      // Mensajes específicos para campos condicionales
      if (controlName === 'placa') {
        return 'La placa del vehículo es obligatoria para este tipo de transporte.';
      }
      if (controlName === 'nom_conductor') {
        return 'El nombre del conductor es obligatorio para este tipo de transporte.';
      }
      if (controlName === 'licencia') {
        return 'La licencia del conductor es obligatoria para este tipo de transporte.';
      }
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
      if (controlName === 'user_id' || controlName === 'operador_id') {
        return 'Solo se permiten números.';
      }
      if (controlName === 'peso_neto' || controlName === 'peso_bruto_humedo' ||
          controlName === 'merma' || controlName === 'humedad') {
        return 'Solo se permiten números. Usar punto (.) para decimales.';
      }
      if (controlName === 'cantidad' || controlName === 'id_municipio_destino') {
        return 'Solo se permiten números.';
      }
      if (controlName === 'nom_conductor') {
        return 'Solo se permiten letras.';
      }
      return 'Formato no válido.';
    }
    return null;
  }

  private actualizarValidacionesSegunTipo(valor: string): void {
    const desComprador = this.formulario.get('des_comprador');
    const desPlanta = this.formulario.get('des_planta');

    if (valor === 'COMPRADOR') {
      desComprador?.enable();
      desComprador?.setValidators([Validators.required]);
      desComprador?.updateValueAndValidity();

      desPlanta?.disable();
      desPlanta?.clearValidators();
      desPlanta?.updateValueAndValidity();
    } else if (valor === 'PLANTA DE TRATAMIENTO') {
      desPlanta?.enable();
      desPlanta?.setValidators([Validators.required]);
      desPlanta?.updateValueAndValidity();

      desComprador?.disable();
      desComprador?.clearValidators();
      desComprador?.updateValueAndValidity();
    } else {
      desComprador?.disable();
      desComprador?.clearValidators();
      desComprador?.updateValueAndValidity();

      desPlanta?.disable();
      desPlanta?.clearValidators();
      desPlanta?.updateValueAndValidity();
    }
  }

  /**
   * Método helper para verificar si un campo debe ser visible/habilitado
   * Útil para mostrar/ocultar campos en el template
   */
  requiereCamposVehiculo(): boolean {
    const tipoTransporteId = this.formulario.get('tipo_transporte')?.value;
    if (!tipoTransporteId) {
      return true; // Por defecto, mostrar los campos
    }

    // Aquí podrías implementar lógica adicional si necesitas
    // mostrar/ocultar campos dinámicamente en el template
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


