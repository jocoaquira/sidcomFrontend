export interface IFuncionarioTranca {
    id: number,
    email: string,
    nombre_apellidos:string,
    ci:string,
    celular:number,
    rol_id:number,
    nombre_rol?:string,
    estado:string,
    created_at?:string,
    updated_at?:string,
}
