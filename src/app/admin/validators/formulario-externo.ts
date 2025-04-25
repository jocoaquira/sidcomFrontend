import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { IFormularioExterno } from '@data/formulario_externo.metadata';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CanCrearTomaDeMuestraGuard } from '../guards/toma-de-muestra/can-crear-toma-de-muestra.guard';

@Injectable()
export class FormularioExternoFormulario implements OnDestroy {
  formulario_externo!: IFormularioExterno;
  formulario: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private canCrearTomaDeMuestra: CanCrearTomaDeMuestraGuard) {
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
      peso_bruto_humedo: new FormControl(this.formulario_externo.peso_bruto_humedo, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)]),
      peso_neto: new FormControl(this.formulario_externo.peso_neto, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)]),
      tara: new FormControl(this.formulario_externo.tara, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0)]),
      humedad: new FormControl(this.formulario_externo.humedad, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0), Validators.max(100)]),
      merma: new FormControl(this.formulario_externo.merma, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$'), Validators.min(0), Validators.max(1)]),
      comprador: new FormControl(this.formulario_externo.comprador, [Validators.required]),
      aduana_id: new FormControl(this.formulario_externo.aduana_id),
      pais_destino_id: new FormControl(this.formulario_externo.pais_destino_id),
      m03_id: new FormControl(this.formulario_externo.m03_id, [Validators.required]),
      tipo_transporte: new FormControl(this.formulario_externo.tipo_transporte, [Validators.required]),
      placa: new FormControl(this.formulario_externo.placa),
      nom_conductor: new FormControl(this.formulario_externo.nom_conductor, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')),
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

    this.formulario.get('des_tipo')?.valueChanges.subscribe((valor: string) => {
      this.actualizarValidacionesSegunTipo(valor);
    });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
