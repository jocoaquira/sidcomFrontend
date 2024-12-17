import { IPermission } from "@data/permissions.metadata";


export interface IApiUserAuthenticated {
    id?:number,
    operador_id:number,
    nombre_completo: string,
    token: string,
    permissions:IPermission[]
}
