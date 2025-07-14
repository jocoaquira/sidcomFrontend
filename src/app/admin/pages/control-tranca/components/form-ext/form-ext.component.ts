import { Component, Input } from '@angular/core';

interface Mineral {
  mineral: string;
  sigla: string;
  ley: string | null;
  unidad: string;
}

interface MunicipioOrigen {
  municipio_origen: string;
  codigo: string;
}

export interface FormularioExternoData {
  id: number;
  nro_formulario: string;
  fecha_emision: string;
  hora_emision: string;
  fecha_vencimiento: string;
  hora_vencimiento: string;
  razon_social: string;
  nit: string;
  nro_nim: string;
  tipo_nim_niar: string;
  operador_id: number;
  m03: string;
  nro_factura_exportacion: string;
  laboratorio: string;
  codigo_analisis: string;
  acta_verificacion: string;
  lote: string;
  presentacion: string;
  merma: string | null;
  tara: string | null;
  cantidad: number;
  humedad: string | null;
  peso_neto: string;
  peso_bruto_humedo: string;
  minerales: Mineral[];
  municipio_origen: MunicipioOrigen[];
  comprador: string;
  aduana: string;
  codigo_aduana: string;
  pais: string;
  tipo_transpote: 'TRAILER' | 'TREN' | string;
  conductor: string;
  placa: string;
  licencia: string;
  observacion: string | null;
  estado: 'VENCIDO' | 'EMITIDO' | 'ANULADO' | string;
  hash: string;
  nro_vagon: string | null;
  empresa_ferrea: string | null;
  fecha_ferrea: string | null;
  hr_ferrea: string | null;
  tara_volqueta: string | null;
}

@Component({
  selector: 'app-form-ext',
  templateUrl: './form-ext.component.html',
  styleUrls: ['./form-ext.component.scss']
})
export class FormExtComponent {
  @Input() formulario!: FormularioExternoData;

  getEstadoClass(): string {
    switch (this.formulario.estado) {
      case 'VENCIDO': return 'estado-vencido';
      case 'EMITIDO': return 'estado-emitido';
      case 'ANULADO': return 'estado-anulado';
      default: return '';
    }
  }

  getEstadoIcon(): string {
    switch (this.formulario.estado) {
      case 'VENCIDO': return 'icon-warning';
      case 'EMITIDO': return 'icon-check';
      case 'ANULADO': return 'icon-block';
      default: return '';
    }
  }

  shouldShowField(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  getTransporteInfo(): { icon: string, details: string[] } {
    if (this.formulario.tipo_transpote === 'TREN') {
      return {
        icon: 'icon-train',
        details: [
          `Vagón: ${this.formulario.nro_vagon || 'N/A'}`,
          `Empresa: ${this.formulario.empresa_ferrea || 'N/A'}`,
          `Fecha férrea: ${this.formulario.fecha_ferrea || 'N/A'}`
        ]
      };
    } else {
      return {
        icon: 'icon-truck',
        details: [
          `Conductor: ${this.formulario.conductor}`,
          `Placa: ${this.formulario.placa}`,
          `Licencia: ${this.formulario.licencia}`
        ]
      };
    }
  }
}