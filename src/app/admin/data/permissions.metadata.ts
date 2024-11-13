import { IPivot } from "./pivot.metadata";

export interface IPermission {
    id?: number,
    name: string,
    guard_name:string,
    created_at?:string,
    updated_at?:string,
    pivot?:IPivot,
}
