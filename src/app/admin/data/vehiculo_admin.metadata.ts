export interface IVehiculoAdmin {
    id?: number,
    operador_id: number,
    placa:string,
    modelo:number,
    marca:string,
    tipo:string,
    estado:string,
    razon_social?:string,
    created_at?:string,
    updated_at?:string
}
