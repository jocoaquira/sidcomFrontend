import { Component, Input } from '@angular/core';

interface Mineral {
  mineral: string;
  sigla: string;
}

interface MunicipioOrigen {
  municipio_origen: string;
  codigo: string;
}

interface MunicipioDestino {
  municipio_destino: string;
  codigo: string;
}

export interface FormularioColaData {
  id: number;
  nro_formulario: string;
  fecha_emision: string;
  hora_emision: string;
  fecha_vencimiento: string;
  hora_vencimiento: string;
  razon_social: string;
  nit: string;
  nro_nim: string;
  operador_id: number;
  lote: string;
  tara: string;
  peso_neto: string;
  peso_bruto_humedo: string;
  minerales: Mineral[];
  municipio_origen: MunicipioOrigen[];
  municipio_destino: MunicipioDestino[];
  tipo_transpote: string;
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
  destino: 'ALMACEN' | 'DIQUE_COLA';
  almacen: string;
  dique_cola: string | null;
}

@Component({
  selector: 'app-form-cola',
  templateUrl: './form-cola.component.html',
  styleUrls: ['./form-cola.component.scss']
})
export class FormColaComponent {
  @Input() formulario!: FormularioColaData;

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