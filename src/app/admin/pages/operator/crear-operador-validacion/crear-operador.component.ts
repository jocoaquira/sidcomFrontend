import { ElementRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IOperator } from '@data/operator.metadata';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { tileLayer, latLng, Marker, marker, MapOptions, Map } from 'leaflet';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { IDepartamento } from '@data/departamento.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IOficina } from '@data/oficina.metadata';
import { IArrendamiento } from '@data/arrendamiento.metadata';
import { OperatorFormulario } from 'src/app/admin/validators/operator';
import { preRegistroService } from './preregistro.service';

@Component({
    templateUrl: './crear-operador.component.html',
})
export class CrearOperadorComponent implements OnInit {
    es: any;

    public operador = new OperatorFormulario();
    public preRegistroOperador: IOperator = null;
    public errorOperator: any = {};
    public operador_registrado!: IOperator;
    @ViewChild('fileUpload') fileUpload: FileUpload;

    public fileNit: File | null = null;
    public fileNim: File | null = null;
    public fileSeprec: File | null = null;
    public fileDocExplotacion: File | null = null;
    public fileRuex: File | null = null;
    public fileResolucion: File | null = null;
    public filePersoneria: File | null = null;
    public fileDocCreacion: File | null = null;
    public fileCi: File | null = null;

    nimniar: any[];
    tipoOperador: any[] = [];
    tipoSucursal: any[] = [];
    tipoCreacion: any[] = [];
    estados: any[] = [];
    estadoOficina: any[] = [];
    tipoExplotacion: any[] = [];
    tipoExtension: any[] = [];
    filteredCountries: any[] = [];
    departamento: IDepartamento[] = [];
    departamento_id: any = 0;
    municipio_id: any = 0;
    municipio_principal: IMunicipio[] = []; // Para dirección legal
    municipio_representante: IMunicipio[] = []; // Para representante legal
    municipio_sucursal: IMunicipio[] = [];
    municipio_arrendamiento: IMunicipio[] = [];
    oficina: IOficina[] = [];
    lista_arrendamiento: IArrendamiento[] = [];

    private departamentoPreRegistro: any = null;

    sucursal: IOficina = {
        id: null,
        operator_id: null,
        departamento_id: null,
        municipio_id: null,
        tipo: '',
        direccion: '',
        latitud: '',
        longitud: '',
        estado: ''
    };

    errorSucursal: IOficina = {
        id: null,
        operator_id: null,
        departamento_id: null,
        municipio_id: null,
        tipo: null,
        direccion: null,
        latitud: null,
        longitud: null,
        estado: null
    };

    arrendamiento: IArrendamiento = {
        id: null,
        operator_id: null,
        codigo_unico: null,
        extension: null,
        unidad_extension: null,
        departamento_id: null,
        denominacion_area: '',
        municipio_id: null,
        tipo_explotacion: null,
        estado: null
    };

    errorArrendamiento: IArrendamiento = {
        id: null,
        operator_id: null,
        codigo_unico: null,
        extension: null,
        unidad_extension: null,
        departamento_id: null,
        denominacion_area: null,
        municipio_id: null,
        tipo_explotacion: null,
        estado: null
    };

    oficinaSelecionadas: IOficina[] = [];
    sw1: number = 0;
    cols: any[] = [];
    sw_mapa: boolean = false;

    public status: string = 'error';
    valSwitch: boolean = false;

    // Variables para el mapa
    options: MapOptions;
    satelliteLayer: any;
    streetLayer: any;
    currentMarker: Marker;
    map: Map;
    submited: boolean = false;
    mapaDialogo: boolean = false;

    constructor(
        private operadorService: OperatorsService,
        private notify: ToastrService,
        private router: Router,
        private municipiosService: MunicipiosService,
        private departamentosService: DepartamentosService,
        private preRegistroServices: preRegistroService
    ) {
        this.nimniar = [
            {name: 'NIM', id: 1},
            {name: 'NIAR', id: 2},
        ];
        this.tipoOperador = [
            {name: 'EMPRESA PRIVADA', id: 3},
            {name: 'COOPERATIVA', id: 1},
            {name: 'EMPRESA ESTATAL', id: 2},
        ];
        this.tipoCreacion = [
            {name: 'LEY', id: 1},
            {name: 'DECRETO SUPREMO', id: 2},
            {name: 'RESOLUCION MINISTERIAL', id: 3},
        ];
        this.tipoExplotacion = [
            {name: 'PATENTE MINERA', id: '1'},
            {name: 'CONTRATO DE ARRENDAMIENTO', id: '2'}
        ];
        this.tipoExtension = [
            {name: 'CUADRICULAS', id: '1'},
            {name: 'HECTAREAS', id: '2'},
            {name: 'METROS CUADRADOS', id: '3'}
        ];
        this.tipoSucursal = [
            {name: 'SUCURSAL', id: '3'},
            {name: 'ALMACEN', id: '1'},
            {name: 'PLANTA DE CONCENTRACION', id: '2'},
            {name: 'PLANTA DE TRATAMIENTO', id: '4'},
            {name: 'MOLINO', id: '5'},
            {name: 'MINA', id: '6'},
            {name: 'OFICINA', id: '7'},
            {name: 'CHANCADORA', id: '8'},
            {name: 'CHANCADORA', id: '9'},
        ];
        this.estados = [
            { label: 'ACTIVO', value: '1' },
            { label: 'INACTIVO', value: '0' }
        ];
        this.estadoOficina = [
            { label: 'ACTIVO', value: '1' },
            { label: 'INACTIVO', value: '0' }
        ];
        this.es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: "Hoy",
            clear: "Limpiar",
            dateFormat: "dd/mm/yy",
            weekHeader: "Sem"
        };
    }

    nombre: any;
    error: any;

    ngOnInit() {
        this.preRegistroServices.currentOperador.subscribe(operador => {
            if (operador) {
                this.preRegistroOperador = operador;
                if (this.departamento && this.departamento.length > 0) {
                    this.precargarFormulario(this.preRegistroOperador);
                } else {
                    this.departamentoPreRegistro = operador.dl_departamento_id;
                }
            }
        });

        this.departamentosService.verdepartamentos(this.nombre).subscribe(
            (data: any) => {
                this.departamento = this.departamentosService.handledepartamento(data);
                if (this.preRegistroOperador) {
                    this.precargarFormulario(this.preRegistroOperador);
                }
            },
            (error: any) => {
                this.error = this.departamentosService.handleError(error);
            }
        );

        // Configurar capas del mapa
        this.satelliteLayer = tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
                maxZoom: 19,
                opacity: 0.4
            }
        );

        this.streetLayer = tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }
        );
    }

    // Método para cambio de departamento (dirección principal)
    cambioDepartamentoPrincipal(departamento_id: any) {
        this.cambioDepartamento(departamento_id, 'principal');
    }

    // Método para cambio de departamento (representante legal)
    cambioDepartamentoRepresentante(departamento_id: any) {
        this.cambioDepartamento(departamento_id, 'representante');
    }

    // Método genérico para cambio de departamento
    cambioDepartamento(departamento_id: any, tipo: 'principal' | 'representante' | 'sucursal' | 'arrendamiento' = 'principal') {
        if (!departamento_id || !departamento_id.value) {
            console.warn('departamento_id is invalid:', departamento_id);
            return;
        }

        if (!this.departamento || this.departamento.length === 0) {
            console.warn('Departamentos array is empty or undefined');
            return;
        }

        let dept: IDepartamento = this.departamento.find(element => element.id === departamento_id.value);

        if (!dept) {
            console.warn('Departamento not found with id:', departamento_id.value);
            return;
        }

        this.municipiosService.vermunicipios(departamento_id.value.toString()).subscribe(
            (data: any) => {
                switch (tipo) {
                    case 'principal':
                        this.municipio_principal = this.municipiosService.handlemunicipio(data);
                        // Actualizar mapa solo para dirección principal
                        if (dept.latitud && dept.longitud) {
                            this.options = {
                                layers: [this.streetLayer, this.satelliteLayer],
                                center: latLng(dept.latitud, dept.longitud),
                                zoom: 13.5
                            };
                            if (this.map && this.map.setView) {
                                this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
                            }
                        }
                        break;
                    case 'representante':
                        this.municipio_representante = this.municipiosService.handlemunicipio(data);
                        break;
                    case 'sucursal':
                        this.municipio_sucursal = this.municipiosService.handlemunicipio(data);
                        break;
                    case 'arrendamiento':
                        this.municipio_arrendamiento = this.municipiosService.handlemunicipio(data);
                        break;
                }
            },
            (error: any) => {
                this.error = this.municipiosService.handleError(error);
                console.error('Error loading municipios:', error);
            }
        );
    }

    cambioDepartamentoSucursal(departamento: any) {
        this.sucursal.departamento_id = departamento.value;
        this.cambioDepartamento(departamento, 'sucursal');
    }

    cambioDepartamentoArrendamiento(departamento: any) {
        this.arrendamiento.departamento_id = departamento.value.id;
        this.cambioDepartamento(departamento, 'arrendamiento');
    }

    precargarFormulario(datos: any) {
        console.log('Precargando formulario con datos:', datos);

        // Precargar el formulario principal
        this.operador.formulario.patchValue({
            razon_social: datos.razon_social || '',
            nit: datos.nit || '',
            nro_nim: datos.nro_nim || '',
            fecha_exp_nim: datos.fecha_exp_nim ? new Date(datos.fecha_exp_nim) : null,
            tipo_operador: String(datos.tipo_operador),
            tipo_nim_niar: datos.tipo_nim_niar,
            nro_personeria: datos.nro_personeria || '',
            nro_matricula_seprec: datos.nro_matricula_seprec || '',
            fecha_exp_seprec: datos.fecha_exp_seprec ? new Date(datos.fecha_exp_seprec) : null,
            tipo_doc_creacion: datos.tipo_doc_creacion || null,
            doc_creacion: datos.doc_creacion || '',
            dl_direccion: datos.dl_direccion || '',
            correo_inst: datos.correo_inst || '',
            tel_fijo: datos.tel_fijo || '',
            celular: datos.celular || null,
            act_exploracion: datos.act_exploracion === 1,
            act_comer_interna: datos.act_comer_interna === 1,
            act_comer_externa: datos.act_comer_externa === 1,
            act_industrializacion: datos.act_industrializacion === 1,
            act_tras_colas: datos.act_tras_colas === 1,
            act_explotacion: datos.act_explotacion === 1,
            act_ben_concentracion: datos.act_ben_concentracion === 1,
            act_refinacion: datos.act_refinacion === 1,
            act_fundicion: datos.act_fundicion === 1,
            nro_ruex: datos.nro_ruex || '',
            nro_res_ministerial: datos.nro_res_ministerial || '',
            act_calcinacion: datos.act_calcinacion === 1,
            act_tostacion: datos.act_tostacion === 1,
            fax_op_min: datos.fax_op_min || '',
            observaciones: datos.observaciones || '',
            ofi_lat: datos.ofi_lat || '',
            ofi_lon: datos.ofi_lon || '',
            otro_celular: datos.otro_celular || null,
            rep_celular: datos.rep_celular || null,
            rep_ci: datos.rep_ci || '',
            rep_correo: datos.rep_correo || '',
            rep_departamento_id: datos.rep_departamento_id || null,
            rep_direccion: datos.rep_direccion || '',
            rep_municipio_id: datos.rep_municipio_id || null,
            rep_nombre_completo: datos.rep_nombre_completo || '',
            rep_telefono: datos.rep_telefono || '',
            fecha_exp_ruex: datos.fecha_exp_ruex ? new Date(datos.fecha_exp_ruex) : null,
            verif_cert_liberacion: datos.verif_cert_liberacion || false,
            comercio_interno_coperativa: datos.comercio_interno_coperativa || false,
            transbordo: datos.transbordo || false,
            traslado_colas: datos.traslado_colas || false,
            verificacion_toma_muestra: datos.verificacion_toma_muestra || false,
            dl_departamento_id: datos.dl_departamento_id || null,
            dl_municipio_id: datos.dl_municipio_id || null,
            estado: datos.estado || null
        });

        // Precargar arrendamientos si existen
        if (datos.arrendamientos && datos.arrendamientos.length > 0) {
            this.lista_arrendamiento = datos.arrendamientos.map((arr: any) => ({
                id: arr.id || null,
                operator_id: arr.operator_id || null,
                codigo_unico: arr.codigo_unico || null,
                extension: arr.extension || null,
                unidad_extension: arr.unidad_extension || null,
                departamento_id: arr.departamento_id || null,
                denominacion_area: arr.denominacion_area || '',
                municipio_id: arr.municipio_id || null,
                tipo_explotacion: arr.tipo_explotacion || null,
                estado: arr.estado || null
            }));
        }

        // Precargar oficinas si existen
        if (datos.oficinas && datos.oficinas.length > 0) {
            this.oficina = datos.oficinas.map((ofi: any) => ({
                id: ofi.id || null,
                operator_id: ofi.operator_id || null,
                departamento_id: ofi.departamento_id || null,
                municipio_id: ofi.municipio_id || null,
                tipo: ofi.tipo || '',
                direccion: ofi.direccion || '',
                latitud: ofi.latitud || '',
                longitud: ofi.longitud || '',
                estado: ofi.estado || ''
            }));
            this.valSwitch = true;
        }

        // Cargar municipios para dirección principal y representante si existen
        if (datos.dl_departamento_id) {
            this.cambioDepartamento({ value: datos.dl_departamento_id }, 'principal');
        }
        if (datos.rep_departamento_id) {
            this.cambioDepartamento({ value: datos.rep_departamento_id }, 'representante');
        }
    }

    formatDate(date: any): string {
        if (date != null) {
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString().split('T')[0];
            }
            console.warn('Fecha inválida:', date);
            return '';
        }
        return null;
    }

    convertBooleansToNumbers = (data: any) => {
        const convertedData = { ...data };
        for (const key in convertedData) {
            if (typeof convertedData[key] === 'boolean') {
                convertedData[key] = convertedData[key] ? 1 : 0;
            }
        }
        return convertedData;
    };

    removeZeroOneProperties = (data: any) => {
        const filteredData = { ...data };
        for (const key in filteredData) {
            if (filteredData[key] === 0) {
                delete filteredData[key];
            }
        }
        return filteredData;
    };

    removeNullProperties = (data: any) => {
        const filteredData = { ...data };
        for (const key in filteredData) {
            if (filteredData[key] === null) {
                delete filteredData[key];
            }
        }
        return filteredData;
    };

    onSubmit() {
        let formData = new FormData();
        let datos = this.convertBooleansToNumbers(this.operador.formulario.value);
        let datofin = this.removeZeroOneProperties(datos);
        datofin = this.removeNullProperties(datofin);

        for (const key in datofin) {
            const value = datofin[key];
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (typeof value === 'number') {
                formData.append(key, value.toString());
            } else {
                formData.append(key, value);
            }
        }

        const listaArrendamientoLimpia = this.lista_arrendamiento.map((item: any) => {
            const { id, operator_id, ...resto } = item;
            return resto;
        });

        const listaOficinaLimpia = this.oficina.map((item: any) => {
            const { id, operator_id, ...resto } = item;
            if (resto.latitud !== undefined) resto.latitud = resto.latitud.toString();
            if (resto.longitud !== undefined) resto.longitud = resto.longitud.toString();
            return resto;
        });

        if (listaArrendamientoLimpia.length > 0) {
            formData.append('arrendamientos', JSON.stringify(listaArrendamientoLimpia));
        }

        if (listaOficinaLimpia.length > 0) {
            formData.append('oficinas', JSON.stringify(listaOficinaLimpia));
        }

        const hasValue = (value: any) => value !== null && value !== undefined && value !== '';

        if (hasValue(this.operador.formulario.value.fecha_exp_nim)) {
            formData.set('fecha_exp_nim', this.formatDate(this.operador.formulario.value.fecha_exp_nim));
        }

        if (hasValue(this.operador.formulario.value.fecha_exp_seprec)) {
            formData.set('fecha_exp_seprec', this.formatDate(this.operador.formulario.value.fecha_exp_seprec));
        }

        if (hasValue(this.operador.formulario.value.fecha_exp_ruex)) {
            formData.set('fecha_exp_ruex', this.formatDate(this.operador.formulario.value.fecha_exp_ruex));
        }

        if (this.fileNit) formData.append('nit_link', this.fileNit);
        if (this.fileNim) formData.append('nim_link', this.fileNim);
        if (this.fileSeprec) formData.append('seprec_link', this.fileSeprec);
        if (this.fileDocExplotacion) formData.append('doc_explotacion_link', this.fileDocExplotacion);
        if (this.fileRuex) formData.append('ruex_link', this.fileRuex);
        if (this.fileResolucion) formData.append('resolucion_min_fundind_link', this.fileResolucion);
        if (this.filePersoneria) formData.append('personeria_juridica_link', this.filePersoneria);
        if (this.fileDocCreacion) formData.append('doc_creacion_estatal_link', this.fileDocCreacion);
        if (this.fileCi) formData.append('ci_link', this.fileCi);

        if (this.operador.formulario.valid) {
            this.operadorService.crearoperator(formData).subscribe(
                (data: any) => {
                    this.operador_registrado = this.operadorService.handleCrearoperator(data);
                    if (data) {
                        this.notify.success('Guardado Correctamente');
                        this.router.navigate(['/admin/operador/']);
                    }
                },
                (error: any) => {
                    this.errorOperator = this.operadorService.handleCrearoperatorError(error);
                    this.status = error.status;
                    this.notify.error(error.message);
                }
            );
        } else {
            this.getFormValidationErrors(this.operador.formulario);
            this.markAllAsTouched(this.operador.formulario);
            this.notify.error('Revise los datos e intente nuevamente', 'Error con el Registro', {
                timeOut: 2000,
                positionClass: 'toast-top-right'
            });
        }
    }

    // Métodos para el mapa
    onMapReady(map: Map) {
        this.map = map;
        this.map.on('click', (event) => {
            this.addMarker(event.latlng.lat, event.latlng.lng);
        });
    }

    addMarker(lat: number, lng: number) {
        if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
        }
        this.currentMarker = marker([lat, lng]).addTo(this.map);
        this.currentMarker.bindPopup(`Latitud: ${lat}, Longitud: ${lng}`).openPopup();
    }

    abrirMapa() {
        if (this.operador.formulario.value.dl_departamento_id) {
            let dept: any = this.departamento.find(val => val.id === this.operador.formulario.value.dl_departamento_id);
            if (this.map) {
                this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
            }
            this.sw_mapa = false;
            this.mapaDialogo = true;
        } else {
            this.notify.error('Seleccione un departamento para abrir el mapa....', 'Error al Abrir el Mapa', { timeOut: 2000, positionClass: 'toast-bottom-right' });
        }
    }

    abrirMapaSucursal() {
        if (this.sucursal.departamento_id) {
            let dept: any = this.departamento.find(val => val.id === this.sucursal.departamento_id);
            if (this.map) {
                this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
            }
            this.sw_mapa = true;
            this.mapaDialogo = true;
        } else {
            this.notify.error('Seleccione un departamento para abrir el mapa....', 'Error al Abrir el Mapa', { timeOut: 2000, positionClass: 'toast-bottom-right' });
        }
    }

    actualizarMapa() {
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
            }, 0);
        }
    }

    agregarPunto() {
        if (this.currentMarker) {
            const position = this.currentMarker.getLatLng();
            if (!this.sw_mapa) {
                this.operador.formulario.patchValue({ ofi_lat: position.lat, ofi_lon: position.lng });
            } else {
                this.sucursal.latitud = position.lat;
                this.sucursal.longitud = position.lng;
            }
            this.mapaDialogo = false;
        } else {
            this.notify.error('Seleccione un punto en el mapa para agregar....', 'Error al Seleccionar un Punto', { timeOut: 2000, positionClass: 'toast-bottom-right' });
        }
    }

    // Métodos auxiliares
    getFormValidationErrors(form: FormGroup) {
        Object.keys(form.controls).forEach(key => {
            const controlErrors = form.get(key)?.errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                    console.log(`Control: ${key}, Error: ${keyError}, Valor:`, controlErrors[keyError]);
                });
            }
        });
    }

    markAllAsTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markAllAsTouched(control);
            }
        });
    }

    // Métodos para cambios en los selects
    cambioMunicipioPrincipal(municipio: any) {
        this.operador.formulario.patchValue({ dl_municipio_id: municipio.value });
    }

    cambioMunicipioRepresentante(municipio: any) {
        this.operador.formulario.patchValue({ rep_municipio_id: municipio.value });
    }

    cambioMunicipioSucursal(municipio: any) {
        this.sucursal.municipio_id = municipio.value.id;
    }

    cambioMunicipioArrendamiento(municipio: any) {
        this.arrendamiento.municipio_id = municipio.value.id;
    }

    cambioEstadoArrendamiento(estado: any) {
        this.arrendamiento.estado = estado.value;
    }

    cambioTipoSucursal(dependencia_id: any) {
        this.sucursal.tipo = this.tipoSucursal.find(element => element.id === dependencia_id.value).name;
    }

    cambioEstadoSucursal(dependencia_id: any) {
        this.sucursal.estado = dependencia_id.value;
    }

    onChangeTipoCreacion(dependencia_id: any) {
        this.operador.formulario.patchValue({ tipo_doc_creacion: dependencia_id });
    }

    onChangeExplotacion(dependencia_id: any) {
        this.arrendamiento.tipo_explotacion = dependencia_id.value.name;
    }

    onFileSelected(event: any, field: string) {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            switch (field) {
                case 'nit_link': this.fileNit = file; break;
                case 'nim_link': this.fileNim = file; break;
                case 'seprec_link': this.fileSeprec = file; break;
                case 'doc_explotacion_link': this.fileDocExplotacion = file; break;
                case 'ruex_link': this.fileRuex = file; break;
                case 'resolucion_min_fundind_link': this.fileResolucion = file; break;
                case 'personeria_juridica_link': this.filePersoneria = file; break;
                case 'doc_creacion_estatal_link': this.fileDocCreacion = file; break;
                case 'ci_link': this.fileCi = file; break;
            }
        }
    }

    agregarDireccion() {
        this.oficina.push({ ...this.sucursal });
        this.sucursal = {
            id: null,
            operator_id: null,
            departamento_id: null,
            municipio_id: null,
            tipo: '',
            direccion: '',
            latitud: '',
            longitud: '',
            estado: ''
        };
    }

    agregarArrendamiento() {
        this.lista_arrendamiento.push({ ...this.arrendamiento });
        this.arrendamiento = {
            id: null,
            operator_id: null,
            codigo_unico: null,
            extension: null,
            unidad_extension: null,
            departamento_id: null,
            denominacion_area: '',
            municipio_id: null,
            tipo_explotacion: null,
            estado: null
        };
    }

    eliminar(domicilio: IOficina) {
        this.oficina = this.oficina.filter(val => val.direccion !== domicilio.direccion);
    }

    verForm() {
        console.log(this.operador.formulario.value);
    }

    codigoUnico(event) {
        this.arrendamiento.codigo_unico = parseInt((event.target as HTMLInputElement).value);
    }

    nroCuadricula(event) {
        this.arrendamiento.extension = parseInt((event.target as HTMLInputElement).value);
    }

    onChangeTipoExtension(event) {
        this.arrendamiento.unidad_extension = event.value.name;
    }

    denominacionAreas(event) {
        this.arrendamiento.denominacion_area = (event.target as HTMLInputElement).value;
    }

    sucursalLatitud(event) {
        this.sucursal.latitud = (event.target as HTMLInputElement).value;
    }

    sucursalDireccion(event) {
        this.sucursal.direccion = (event.target as HTMLInputElement).value;
    }

    sucursalLongitud(event) {
        this.sucursal.longitud = (event.target as HTMLInputElement).value;
    }

    valSwitches(event: any) {
        this.valSwitch = event.checked;
    }
}
