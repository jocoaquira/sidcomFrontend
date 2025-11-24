export interface ITomaDeMuestra {
    id?:number,
    user_id:number,
    operador_id:number,
    responsable_tdm_id:number,
    responsable_tdm_senarecom_id:number,
    responsable_tdm_gador_id:number,
    nro_formulario:string,
    lugar_verificacion:string,
    ubicacion_lat:string,
    ubicacion_lon:string,
    departamento_id:number,
    municipio_id:number,
    lote:string,
    //-----ultimos agregados--------
    merma:number,
    m03_id:string,
    laboratorio:string,
    comprador:string,
    codigo_analisis:string,
    aduana_id:number,
    pais_destino_id:number,
    nro_factura_exportacion:string,
    nro_camiones_parcial?:number,
    nro_parcial?:number,
    procedimiento_parcial?:string,
    generar_parcial?:boolean,

    presentacion_id:string,
    cantidad:number,
    nro_camiones:number,
    total_parcial:number,
    peso_neto_total:number,
    peso_neto_parcial:number,
    humedad:number,
    nro_parciales:number
    tipo_muestra:string,
    observaciones: string,
    fecha_hora_tdm:string,
    fecha_creacion: string,
    fecha_modificacion:string,
    fecha_aprobacion: string,
    fecha_firma:string,
    justificacion_anulacion: string,
    estado:string,  //'GENERADO','SOLICITADO','APROBADO','FIRMADO', 'ANULADO'
    created_at?:string,
    updated_at?:string
}

export interface ITomaDeMuestraDetalleProcedimiento {
    id:number,
    toma_de_muestra_id:number,
    procedimiento_id:number
}
export interface ITomaDeMuestraProcedimiento {
    id:number,
    nombre:string,
    procedimiento:string
}
export interface IAnulacionTomaDeMuestra {
    id:number,
    estado:string,
    justificacion_anulacion: string
}

