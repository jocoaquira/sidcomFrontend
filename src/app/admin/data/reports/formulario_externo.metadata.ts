export interface IMineralExterno {
  mineral: string;
  sigla: string;
  ley: string;
  unidad: string;
}

export interface IMunicipioOrigenExterno {
  municipio_origen: string;
  codigo: string;
  departamento?: string;
}

export interface IFormularioExternoReporte {
  nro_formulario: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  razon_social: string;
  representante_legal?: string;
  ci_representante_legal?: string;
  tipo_operador: number;
  IDOM?: string;
  nit: string;
  nro_nim: string;
  tipo_nim_niar: string;
  m03?: string;
  nro_factura_exportacion?: string;
  laboratorio?: string;
  codigo_analisis?: string;
  acta_verificacion?: string;
  lote: string;
  presentacion: string;
  merma: string;
  tara: string;
  humedad: string;
  peso_neto: string;
  cantidad: number;
  peso_bruto_humedo: string;
  minerales: IMineralExterno[];
  municipio_origen: IMunicipioOrigenExterno[];
  comprador: string;
  pais?: string;
  aduana?: string;
  codigo_aduana?: string;
  tipo_transporte: string;
  conductor: string;
  placa: string;
  licencia: string;
  observacion?: string;
  observaciones?: string;
  nro_vagon?: string;
  empresa_ferrea?: string;
  fecha_ferrea?: string;
  hr_ferrea?: string;
  tara_volqueta?: string;
  anulacion?: string;
  estado: string;
}
