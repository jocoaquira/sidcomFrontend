export interface ITomaDeMuestraSimple {
    id:number,
    nro_formulario:string,
    lugar_verificacion:string,
    ubicacion_lat:string,
    ubicacion_lon:string,
    fecha_hora_tdm:string,
    created_at:string,
    updated_at:string,
    fecha_aprobacion:string,
    fecha_firma:string,
    estado:string,
    razon_social:string,
    responsable_tdm_id:number,
    operador_id:number,
    generar_parcial?:boolean
}

