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
    presentacion:string,
    cantidad:number,
    nro_camiones:number,
    total_parcial:number,
    peso_neto_total:number,
    peso_neto_parcial:number,
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

