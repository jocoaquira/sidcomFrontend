export interface ITurnoTranca{
  id?:number,
  trancaId:number,
  usuarioId:number,
  fecha_inicio:string,
  fecha_fin:string
}
export interface ITurnoTrancaLista{
    id?:number,
    trancaId:number,
    usuarioId:number,
    fecha_inicio:string,
    fecha_fin:string
    nombre_tranca?:string,
    nombre_apellidos?:string,
  }
