export interface IChoferAdmin {
    id?: number,
    operador_id: number,
    nombre_apellidos:string,
    nro_licencia:string,
    celular?:string,
    fecha_vencimiento?:string,
    categoria?:string,
    fecha_nacimiento?:string,
    estado:string,
    razon_social?:string,
    created_at?:string,
    updated_at?:string
}
