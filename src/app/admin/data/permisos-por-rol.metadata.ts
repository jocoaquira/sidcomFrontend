import { IPermiso } from "./permisos.metadata";

export interface IPermisoRol {
    id:number,
    nombre: string,  
    permissions:IPermiso[]
}
