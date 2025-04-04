export interface IArrendamiento{
    id?:number,
    operator_id?:number,
    codigo_unico?:number,
    extension:number,
    unidad_extension:number,
    denominacion_area?:string,
    municipio_id:number,
    departamento_id:number,
    tipo_explotacion:string,
    estado:string
}
