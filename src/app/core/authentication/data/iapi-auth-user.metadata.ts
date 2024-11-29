import { IPermission } from "@data/permissions.metadata";


export interface IApiUserAuthenticated {
    id?:number,
    operator_id:number,
    nombre_completo: string,
    token: string,
    permissions:IPermission[]
}
