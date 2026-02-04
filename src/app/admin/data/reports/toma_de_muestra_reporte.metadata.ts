export interface ITomaDeMuestraReporte {
    fecha_aprobacion: string;
    fecha_firma: string;
    peso_neto: number;
    lote: string;
    camiones: number;
    estado: string;
    cantidad: number;
    observaciones: string;
    nro_formulario: string;
    lugar_verificacion: string;
    razon_social: string;
    representante_legal: string;
    nit: string;
    tipo_operador: number;
    rep_ci: string;
    municipio: string;
    departamento: string;
    responsable_muestra: string;
    responsable_senarecom: string;
    responsable_gador: string;
    presentacion: string;
    humedad: number;
    tipo_muestra: string;
    mo3: string;
    codigo_analisis: string;
    comprador: string;
    nro_factura_exportacion: string;
    laboratorio: string;
    merma: number;
    aduana_id: number;
    pais_destino_id: number;
    nro_parcial: number;
    nro_camiones_parcial: number;
    generar_parcial: boolean;
    procedimiento_parcial: string;
    minerales: {
        mineral: string;
        sigla: string;
        ley: number;
        unidad: string;
    }[];
    municipio_origen: {
        municipio_origen: string;
    }[];
    procedimiento: {
        procedimientoID: string;
        nombre: string;
        num_paso: string;
    }[];
}
