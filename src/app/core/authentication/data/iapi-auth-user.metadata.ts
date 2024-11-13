import { IPermission } from "@data/permissions.metadata";


export interface IApiUserAuthenticated {
    id?:number,
    empleado_id:number,
    item_id?:number,
    contrato_id?:number,
    nombre_completo: string,
    edad: number,
    token: string,
    avatar: string,
    permissions:IPermission[]
}
