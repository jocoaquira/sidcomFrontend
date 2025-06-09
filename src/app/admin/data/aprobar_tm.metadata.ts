export interface IAprobarTM {
   id?:number,
   estado:string,
   observaciones?:string,
   operador_id?:string,
   tipo_muestra?:string,
   responsable_tdm_senarecom_id:number,
   procedimiento:IProcedimientoReducido[]
}
export interface IProcedimientoReducido {
   id:number
}
