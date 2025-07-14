import { Component, Input } from '@angular/core';
import { IFormularioInternoPDF } from '@data/formulario_interno_pdf.metadata';

interface Mineral {
  mineral: string;
  sigla: string;
  ley: string;
  unidad: string;
}

interface MunicipioOrigen {
  municipio_origen: string;
  codigo: string;
}

export interface FormularioInternoData {
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
  lote: string;
  presentacion: string;
  merma: string;
  tara: string;
  humedad: string;
  peso_neto: string;
  cantidad: number | null;
  peso_bruto_humedo: string;
  minerales: Mineral[];
  municipio_origen: MunicipioOrigen[];
  des_tipo:string,
  comprador: string;
  munipio_destino: string;
  departamento_destino: string;
  tipo_transpote: string;
  tara_volqueta: string | null;
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
}

@Component({
  selector: 'app-form-int',
  templateUrl: './form-int.component.html',
  styleUrls: ['./form-int.component.scss']
})
export class FormIntComponent {
  @Input() formulario!: IFormularioInternoPDF;

  getEstadoClass(): string {
    switch (this.formulario.estado) {
      case 'VENCIDO': return 'estado-vencido';
      case 'EMITIDO': return 'estado-emitido';
      case 'ANULADO': return 'estado-anulado';
      default: return '';
    }
  }

  shouldShowField(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }
}
