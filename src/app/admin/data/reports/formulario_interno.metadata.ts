// Interfaces auxiliares
export interface IMineral {
  mineral: string;
  sigla: string;
  ley: string;
  unidad: string;
}

export interface IMunicipioOrigen {
  municipio_origen: string;
  codigo: string;
  departamento: string;
}

export interface IFormularioTranca {
  fecha_control: string;
  hora_control: string;
  nombre_usuario: string;
  tranca: string;
}

// Interface principal del formulario
export interface IFormularioInternoReporte {
  nro_formulario: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  razon_social: string;
  representante_legal: string;
  ci_representante_legal: string;
  tipo_operador: number;
  IDOM: string;
  nit: string;
  nro_nim: string;
  tipo_nim_niar: string;
  lote: string;
  presentacion: string;
  merma: string;
  tara: string;
  humedad: string;
  peso_neto: string;
  cantidad: number;
  peso_bruto_humedo: string;
  formulario_tranca: IFormularioTranca[];
  minerales: IMineral[];
  municipio_origen: IMunicipioOrigen[];
  comprador: string;
  planta_tratamiento: string;
  tipo_mineral: string | null;
  municipio_destino: string;
  departamento_destino: string;
  tipo_transporte: string;
  conductor: string;
  placa: string;
  licencia: string;
  observaciones: string | null;
  nro_vagon: string | null;
  empresa_ferrea: string | null;
  fecha_ferrea: string | null;
  hr_ferrea: string | null;
  anulacion: string | null;
  nro_viajes: number | null;
  estado: string;
}
