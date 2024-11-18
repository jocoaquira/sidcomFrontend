export interface IFormularioInterno {
   id?:number,
   user_id:number,
   operator_id:number,
   nro_formulario:string,
   lote:string,
   presentacion:string,
   cantidad:number,
   peso_bruto_humedo:number,
   peso_neto_seco:number,
   tara:number,
   humedad:number,
   merma:number,
   des_tipo:string,
   des_comprador?:string,
   des_planta: string,
   id_municipio_destino: string,
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
   traslado_mineral:string,
   nro_viajes:number
}
