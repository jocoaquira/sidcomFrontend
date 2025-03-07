export interface ITDMNroForm {
    id?:number,
    nro_formulario:string,

    lote:string,
    presentacion_id:number,
    cantidad?:number,
    peso_neto:number,
    humedad?:number,

    estado:string //'GENERADO','EMITIDO','VENCIDO', 'ANULADO'
    minerales:IMinerales[],
    municipio_origen:IMunicipioOrigen[]
 }

export interface IMinerales{
    mineralId:number,
    sigla:string,
    ley:number,
    unidad:string
}
export interface IMunicipioOrigen {
    municipio_origen_id:number,
    departemento_id:string
}
