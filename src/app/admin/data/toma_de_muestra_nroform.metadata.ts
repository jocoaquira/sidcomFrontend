export interface ITDMNroForm {
    id?:number,
    nro_formulario:string,

    lote:string,
    presentacion_id:number,
    cantidad?:number,
    peso_neto:number,
    humedad?:number,
    merma?:number,
    m03_id?:string,
    nro_factura_exportacion?:string,
    laboratorio?:string,
    codigo_analisis?:string,
    comprador?:string,
    pais_destino_id?:number,
    aduana_id?:number,

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
