export interface IActividadExplotacion {
   id?:number,
   operator_id:number,
   codigo_unico:string,//nullable
   nro_cuadriculas:string,
   denominacion_areas:number,
   municipio_id:number,
   tipo_explotacion:string,//PATENTE MINERA, CONTRATO DE ARRENDAMIENTO
   tipo:string,
   observaciones:string//nullable
   estado:string,//ACTIVO, INACTIVO
}
