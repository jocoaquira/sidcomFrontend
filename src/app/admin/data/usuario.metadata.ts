export interface IUsuario {
    id: number,
    email: string,
    email_verified_at:string,
    nombre:string,
    apellidos:string,
    ci:string,
    celular:number,
    rol_id:number,
    operador_id:number,
    razon_social?:string,
    nombre_rol?:string,
    estado:string,
    created_at:string,
    updated_at:string,
    pass_gen:string,
    password?:string,
    repetir_password?:string
}
