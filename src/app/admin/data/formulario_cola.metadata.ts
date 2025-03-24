export interface IFormularioCola {
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
