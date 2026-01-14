export interface ITomaDeMuestraSimpleOperador {
    id:number,
    nro_formulario:string,
    lugar_verificacion:string,
    ubicacion_lat?:string,
    ubicacion_lon?:string,
    fecha_hora_tdm:string,
    fecha_aprobacion:string,
    fecha_firma?:string,
    estado?:string,
    generar_parcial?:boolean,
    procedimiento_parcial?:string,
    tipo_muestra?:string,
    responsableTM:string,
    responsableTM_id:number,
    operador_id:number
}

