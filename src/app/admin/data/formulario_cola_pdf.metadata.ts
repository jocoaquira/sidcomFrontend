
export interface IFormularioTrasladoColaPDF {
    id: number,
	fecha_emision: string,
	hora_emision: string,
	fecha_vencimiento: string,
	hora_vencimiento: string,
    razon_social: string,
    operador_id:number,
    nro_nim:string,
    nit:string
    peso_bruto_humedo:number,
	peso_neto: number,
	lote: string,
    tara:number,
    municipio: string,
	camiones: number,
	humedad:number,
	nro_formulario: string,
	hash:string,

    estado:string,
	observaciones:string,

    tipo_transporte: string,
	conductor: string,
	placa: string,
	licencia: string,
	nro_vagon: number,
	empresa_ferrea: string,
	fecha_ferrea: string,
	hr_ferrea: string,
	destino: string,
	almacen: string,
	dique_cola: string


    minerales:IMineralTDM[],
    municipio_origen:IMunicipioOrigen[],
    municipio_destino:IMunicipioOrigen[],
    control_trancas:IControlTranca[]
}

export interface IMineralTDM {
    mineral:string,
    sigla:string
}
export interface IMunicipioOrigen {
    municipio_origen:string
    codigo:string
}
interface IControlTranca{
    nombre_tranca:string,
    nombre_funcionario:string,
    observaciones:string
    fecha_inspeccion:string
}

