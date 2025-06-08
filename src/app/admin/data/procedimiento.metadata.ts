import { IProcedimientoDetalle } from "./procedimiento_detalle.metadata"

export interface IProcedimiento {
    id?: number,
    nombre:string,
    estado:string,
    muestras?:IProcedimientoDetalle[]
}
