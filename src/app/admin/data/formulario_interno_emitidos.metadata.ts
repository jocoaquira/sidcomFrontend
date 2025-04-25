export interface IFormularioInternoEmitidos {
    hoy:IReporte,
    semana:IReporte,
    mes:IReporte,
    anio:IReporte
}
export interface IReporte{
    emitidos: number,
    vencidos: number,
    generados: number,
    anulados: number
}

