import { Component, Input } from '@angular/core';

interface Mineral {
  mineral: string;
  sigla: string;
  ley: string;
  unidad: string;
}

interface MunicipioOrigen {
  municipio_origen: string;
}

interface Procedimiento {
  procedimientoID: string;
  nombre: string;
  num_paso: string;
}

export interface FormularioTomaMuestraData {
  id: number;
  fecha_aprobacion: string;
  hora_aprobacion: string;
  fecha_firma: string;
  hora_firma: string;
  peso_neto: string;
  lote: string;
  camiones: number;
  estado: string;
  hash: string;
  cantidad: number | null;
  observaciones: string;
  nro_formulario: string;
  lugar_verificacion: string;
  razon_social: string;
  municipio: string;
  responsable_muestra: string;
  responsable_senarecom: string;
  responsable_gador: string;
  presentacion: string;
  foto_link: string;
  humedad: string;
  tipo_muestra: string;
  minerales: Mineral[];
  municipio_origen: MunicipioOrigen[];
  procedimiento: Procedimiento[];
}

@Component({
  selector: 'app-form-tdm',
  templateUrl: './form-tdm.component.html',
  styleUrls: ['./form-tdm.component.scss']
})
export class FormTDMComponent {
  @Input() formulario!: FormularioTomaMuestraData;

  getImageUrl(path: string): string {
    if (path) {
      // Corrige las barras y construye la URL completa
      const correctedPath = path.replace(/\\/g, '/');
      const backendUrl = localStorage.getItem('url-backend') || 'https://tu-api.com/';
      return backendUrl + correctedPath;
    }
    // Imagen por defecto si no hay path
    return 'assets/images/imagen-no-disponible.png';
  }
}