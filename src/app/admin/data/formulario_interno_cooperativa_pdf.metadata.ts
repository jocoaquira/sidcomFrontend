export interface IFormularioInternoCooperativaPDF{
	id:number,
	nro_formulario:string,
	fecha_emision:string,
	hora_emision:string,
	fecha_vencimiento:string,
	hora_vencimiento:string,
	razon_social:string,
	nit:string,
	nro_nim:string,
	tipo_nim_niar:string,
	operador_id:string,

	lote:string,
	presentacion:number,
	merma:number,
	tara:number,
	humedad:number,
	peso_neto:number,
	cantidad:number,
	peso_bruto_humedo:number,

	minerales:IMineral[],
	municipio_origen:IMunicipioOrigen[],

	comprador:string,
	munipio_destino:string
	departamento_destino:string,
	tipo_transporte:string,
	conductor:string,
	placa:string,
	licencia:string,
	observacion:string,
	estado:string,
	hash:string,
	nro_vagon:string,
	empresa_ferrea:string,
	fecha_ferrea:string,
	hr_ferrea:string,
	tara_volqueta:string
}
export interface IMineral {
    mineral:string,
    sigla:string,
    ley:string,
    unidad:string
}
export interface IMunicipioOrigen {
    municipio_origen:string,
	codigo:string,
}
