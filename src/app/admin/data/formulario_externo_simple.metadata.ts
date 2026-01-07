export interface IFormularioExternoSimple {
    id:number,
    operador_id:number,
    nro_formulario:string,
    lote?:string,
    razon_social:string,
    fecha_creacion:string,
    fecha_vencimiento:string,
    control_trancas:IControlTranca[],
    estado:string
}
interface IControlTranca{
    nombre_tranca:string,
    nombre_funcionario:string,
    observaciones:string
    fecha_inspeccion:string
}

