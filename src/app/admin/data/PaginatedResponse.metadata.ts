import { IFormularioInternoSimple } from "./formulario_interno_simple.metadata";

export interface IPaginatedResponse {
    data: IFormularioInternoSimple[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
