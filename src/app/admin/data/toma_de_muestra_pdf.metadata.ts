export interface ITomaDeMuestraPDF {
    id: number,
	fecha_aprobacion: string,
	hora_aprobacion: string,
	fecha_firma: string,
	hora_firma: string,
	peso_neto: number,
	lote: string,
    municipio: string,
	camiones: number,
	nro_formulario: string,
	lugar_verificacion: string,
	razon_social: string,
	responsable_muestra: string,
	responsable_senarecom: string,
	responsable_gador: string,
	presentacion: string,
	hash:string,
    estado:string,
	observaciones:string,
    minerales:IMineralTDM[],
    municipio_origen:IMunicipioOrigenTDM[],
    procedimiento:IProcedimientoTDM[],
}

export interface IMineralTDM {
    mineral:string,
    sigla:string,
    ley:string,
    unidad:string
}
export interface IMunicipioOrigenTDM {
    municipio_origen:string
}
export interface IProcedimientoTDM {
    nombre:string,
    procedimiento: string
}

