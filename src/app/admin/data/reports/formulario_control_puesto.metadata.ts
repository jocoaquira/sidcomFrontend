export interface IFormularioTranca {
    hora_control: string;
    fecha_control: string;
    nombre_usuario: string;
    tranca: string;
}

export interface IMineral {
    mineral: string;
    sigla: string;
}

export interface IMunicipioOrigen {
    municipio_origen: string;
    codigo: string;
    departamento: string;
}

export interface IMunicipioDestino {
    municipio_destino: string;
    codigo: string;
    departamento: string;
}

export interface IFormularioControlTranca {
    formulario_tranca: IFormularioTranca[];
    conductor: string;
    placa: string;
    licencia: string;
    razon_social: string;
    minerales: IMineral[];
    peso_neto: string;
    municipio_origen: IMunicipioOrigen[];
    municipio_destino?: IMunicipioDestino[]; // Opcional
    pais_destino?: string; // Opcional
    departamento_destino?: string;
    des_planta?: string;
    des_tipo?: string;
    compradores?: {
        municipio_destino?: string;
        departamento_destino?: string;
        comprador?: string;
        cantidad?: number;
    }[];
    tipo_formulario: string;
    nro_formulario: string;
}
