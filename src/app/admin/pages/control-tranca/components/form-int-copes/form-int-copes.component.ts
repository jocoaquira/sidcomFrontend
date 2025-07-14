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

interface FormularioData {
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
  merma: string | null;
  tara: string | null;
  humedad: string | null;
  peso_neto: string;
  cantidad: number;
  peso_bruto_humedo: string;
  minerales: Mineral[];
  municipio_origen: MunicipioOrigen[];
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
  selector: 'app-form-int-copes',
  templateUrl: './form-int-copes.component.html',
  styleUrls: ['./form-int-copes.component.scss']
})
export class FormIntCopesComponent {
  @Input() formulario: FormularioData;

  getEstadoClass(): string {
    switch (this.formulario.estado) {
      case 'VENCIDO':
        return 'estado-vencido';
      case 'EMITIDO':
        return 'estado-emitido';
      case 'ANULADO':
        return 'estado-anulado';
      default:
        return '';
    }
  }
}