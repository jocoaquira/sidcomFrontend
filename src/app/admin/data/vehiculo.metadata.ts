export interface IVehiculo {
    id?: number,
    operador_id: number,
    placa:string,
    modelo:string,
    marca:string,
    tipo:string,
    estado:string,

    created_at?:string,
    updated_at?:string
}
