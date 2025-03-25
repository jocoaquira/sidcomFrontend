/*export interface IFormularioColaPDF {
   id?:number,
   user_id:number,
   operador_id:number,
   nro_formulario:string,
   lote:string,
   peso_bruto:number,
   tara:number,

   destino:string,
   almacen?:string,
   dique_de_colas: string,

   tipo_transporte: string,
   placa: string,
   nom_conductor: string,
   licencia: string,
   observaciones: string,
   fecha_creacion: string,
   fecha_vencimiento: string,
   justificacion_anulacion: string,
   estado:string //'GENERADO','EMITIDO','VENCIDO', 'ANULADO'

   nro_vagon:string,
   empresa_ferrea:string,
   fecha_ferrea:string,
   hr_ferrea:string,
   tara_volqueta:string,

   //copes
   nro_viajes:number
}
*/

export interface IFormularioColaPDF {
    id: number,
	fecha_aprobacion: string,
	hora_aprobacion: string,
	fecha_firma: string,
	hora_firma: string,
	peso_neto: number,
	lote: string,
    municipio: string,
	camiones: number,
	humedad:number,
	nro_formulario: string,
	lugar_verificacion: string,
	razon_social: string,
	responsable_muestra: string,
	responsable_senarecom: string,
	responsable_gador: string,
	presentacion: string,
	hash:string,
	foto_link:string
    estado:string,
	observaciones:string,
    minerales:IMineralTDM[],
    municipio_origen:IMunicipioOrigenTDM[],
    procedimiento:IProcedimientoTDM[],
}

export interface IMineralTDM {
    mineral:string,
    sigla:string,
    ley:string,
    unidad:string
}
export interface IMunicipioOrigenTDM {
    municipio_origen:string
}
export interface IProcedimientoTDM {
    nombre:string,
    procedimiento: string
}

