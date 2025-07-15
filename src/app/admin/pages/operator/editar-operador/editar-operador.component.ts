import { ElementRef , Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOperator } from '@data/operator.metadata';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { tileLayer, latLng, Marker,marker, MapOptions,Map, LeafletEvent , control } from 'leaflet';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { IDepartamento } from '@data/departamento.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IOficina } from '@data/oficina.metadata';
import { IArrendamiento } from '@data/arrendamiento.metadata';
import { OperatorFormulario } from 'src/app/admin/validators/operator';
@Component({
    templateUrl: './editar-operador.component.html',

})
export class EditarOperadorComponent implements OnInit {
    es: any;

    public operador=new OperatorFormulario();
    public errorOperator:any={};
    public operador_registrado!:IOperator;
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
    tipoOperador: any[]=[];
    tipoSucursal: any[]=[];
    tipoCreacion:any[]=[];
    estados:any[]=[];
    estadoOficina:any[]=[];
    tipoExplotacion:any[]=[];
    tipoExtension:any[]=[];
    filteredCountries: any[] = [];
    departamento:IDepartamento[]=[];
    departamento_id:any=0;
    municipio_id:any=0;
    municipio:IMunicipio[]=[];
    municipio_sucursal:IMunicipio[]=[];
    municipio_arrendamiento:IMunicipio[]=[];
    oficina:IOficina[]=[];
    lista_arrendamiento:IArrendamiento[]=[];
    sucursal:IOficina={
        id:null,
        operator_id:null,
        departamento_id:null,
        municipio_id:null,
        tipo:'',
        direccion:'',
        latitud:'',
        longitud:'',
        estado:''
    };
    errorSucursal:IOficina={
        id:null,
        operator_id:null,
        departamento_id:null,
        municipio_id:null,
        tipo:null,
        direccion:null,
        latitud:null,
        longitud:null,
        estado:null
    };
    arrendamiento:IArrendamiento={
        id:null,
        operator_id:null,
        codigo_unico:null,
        extension:null,
        unidad_extension:null,
        departamento_id:null,
        denominacion_area:'',
        municipio_id:null,
        tipo_explotacion:null,
        estado:null
    };
    errorArrendamiento:IArrendamiento={
        id:null,
        operator_id:null,
        codigo_unico:null,
        extension:null,
        unidad_extension:null,
        departamento_id:null,
        denominacion_area:null,
        municipio_id:null,
        tipo_explotacion:null,
        estado:null
    };
    oficinaSelecionadas:IOficina[]=[];
    sw1:number=0;
    cols:any[]=[];
    sw_mapa:boolean=false;

    public status:string='error';
    valSwitch: boolean = false;
    constructor(
        private operadorService:OperatorsService,
        private notify:ToastrService,
        private router:Router,
        private municipiosService:MunicipiosService,
        private departamentosService:DepartamentosService,
        private route: ActivatedRoute
    ) {
        this.nimniar = [
            {name: 'NIM', id: '1'},
            {name: 'NIAR', id: '2'},
        ];
        this.tipoOperador = [
            {name: 'EMPRESA PRIVADA', id: '3'},
            {name: 'COOPERATIVA', id: '1'},
            {name: 'EMPRESA ESTATAL', id: '2'},
        ];
        this.tipoCreacion = [
            {name: 'LEY', id: '1'},
            {name: 'DECRETO SUPREMO', id: '2'},
            {name: 'RESOLUCION MINISTERIAL', id: '3'},
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
        this.estadoOficina= [
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
     nombre:any;
     error:any;
    ngOnInit() {
        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];


        this.departamentosService.verdepartamentos(this.nombre).subscribe(
            (data:any)=>{
            this.departamento=this.departamentosService.handledepartamento(data);
            console.log(data);
          },
          (error:any)=> this.error=this.departamentosService.handleError(error)
        );


          this.satelliteLayer = tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
              attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
              maxZoom: 19,
              opacity:0.4
            }
          );
          // Capa de calles de OpenStreetMap
          this.streetLayer = tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
            }
          );
        // 3. Obtener el ID del operador desde la URL y cargar los datos
        this.route.params.subscribe(params => {
            const operadorId = params['id']; // Asumiendo que el ID viene en la URL
            if (operadorId) {
                this.cargarDatosOperador(operadorId);
            }
        });
    }

//------------------------------- 4. Método para cargar los datos del operador-------------------------------------------------
cargarDatosOperador(id: string) {
    this.operadorService.verOperator(id).subscribe(
        (data: any) => {
            this.operador_registrado = data;
            console.log(this.operador_registrado)
            this.precargarFormulario(data);
        },
        (error: any) => {
            this.error = this.operadorService.handleError(error);
            this.notify.error('Error al cargar los datos del operador');
        }
    );
}
//-----------------------------------PRE CARGAR LOS DATOS DE OPERADOR-----------------------------------------------------------
precargarFormulario(datos: any) {
    // Precargar el formulario principal
    this.operador.formulario.patchValue({
        razon_social: datos.razon_social || '',
        nit: datos.nit || '',
        nro_nim: datos.nro_nim || '',
        fecha_exp_nim: datos.fecha_exp_nim ? new Date(datos.fecha_exp_nim) : null,
        tipo_operador:String(datos.tipo_operador),
        tipo_nim_niar:datos.tipo_nim_niar,
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
        estado:datos.estado||null
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
        this.valSwitch=true;
    }

    // Cargar municipios si hay un departamento seleccionado
    if (datos.dl_departamento_id) {
        this.cambioDepartamento({ value: datos.dl_departamento_id });
    }

    // Establecer valores para los switches
    //this.valSwitch = datos.verif_cert_liberacion || false;
}


    formatDate(date: any): string {
        console.log(date);
        if(date!=null){
        const parsedDate = new Date(date); // Forzar conversión
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
        }
        console.warn('Fecha inválida:', date);
        return ''; // Retorna vacío si no es una fecha válida
        }
        else return null;
    }

// Función para convertir true/false en 1/0
 convertBooleansToNumbers = (data: any) => {
    const convertedData = { ...data }; // Copiar el objeto para no mutar el original
    for (const key in convertedData) {
      if (typeof convertedData[key] === 'boolean') {
        convertedData[key] = convertedData[key] ? 1 : 0;
      }
    }
    return convertedData;
  };
// Función para eliminar las propiedades con valores 0 o 1
 removeZeroOneProperties = (data: any) => {
    const filteredData = { ...data }; // Copiar el objeto para no mutar el original

    for (const key in filteredData) {
      if (filteredData[key] === 0) {
        delete filteredData[key]; // Eliminar las propiedades con 0 o 1
      }
    }

    return filteredData;
  };
  removeNullProperties = (data: any) => {
    const filteredData = { ...data }; // Copiar el objeto para no mutar el original

    for (const key in filteredData) {
      if (filteredData[key] === null) {
        delete filteredData[key]; // Eliminar solo las propiedades con null
      }
    }

    return filteredData;
  };


    onSubmit() {
        let operador_id:string=null;
        let formData = new FormData();
        if (this.operador_registrado && this.operador_registrado.id) {
                formData.append('id', this.operador_registrado.id.toString());
                operador_id=this.operador_registrado.id.toString()
            }

        // Agregar todos los valores del formulario a formData
        let datos=this.convertBooleansToNumbers(this.operador.formulario.value)
        let datofin=this.removeZeroOneProperties(datos);
       /*Object.keys(datofin).forEach(key => {
            if (datofin[key] !== null && datofin[key] !== undefined) {
                formData.append(key, datofin[key]);
            }
        });*/
        datofin=this.removeNullProperties(datofin);
        for (const key in datofin) {
            const value = datofin[key];

            // Verificar el tipo de dato y convertir si es necesario
            if (typeof value === 'boolean') {
              // Convertir el valor booleano a número (1 o 0)
              formData.append(key, value ? '1' : '0');
            } else if (typeof value === 'number') {
              // Si es un número, agregarlo tal cual
              formData.append(key, value.toString()); // Aunque FormData convierte, es recomendable asegurarse de que sea un string
            } else {
              // Para cadenas de texto o cualquier otro tipo, agregar como está
              formData.append(key, value);
            }
          }
          const listaArrendamientoLimpia = this.lista_arrendamiento.map((item: any) => {
            const { id, operator_id, ...resto } = item; // Extraer los campos no deseados
            return resto; // Retornar el objeto sin id y operator_id
          });
          const listaOficinaLimpia = this.oficina.map((item: any) => {
                const { id, operator_id, ...resto } = item;

                // Convertir latitud y longitud a string si existen
                if (resto.latitud !== undefined) {
                    resto.latitud = resto.latitud.toString();
                }
                if (resto.longitud !== undefined) {
                    resto.longitud = resto.longitud.toString();
                }

                return resto;
          });

        // Solo agregar arrendamientos si hay elementos
        if (listaArrendamientoLimpia.length > 0) {
            formData.append('arrendamientos', JSON.stringify(listaArrendamientoLimpia));
        }

        // Solo agregar oficinas si hay elementos
        if (listaOficinaLimpia.length > 0) {
            formData.append('oficinas', JSON.stringify(listaOficinaLimpia));
        }

        // Convertir fechas al formato adecuado antes de enviarlas
        // Verificando null, undefined y cadena vacía
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

        // Agregar archivos (debes tener referencias a los archivos en tu formulario)
        // Agregar los archivos si existen
        if (this.fileNit) {
            console.log('Añadiendo archivo Nit:', this.fileNit);
            formData.append('nit_link', this.fileNit);
        }
        if (this.fileNim) {
            console.log('Añadiendo archivo Nim:', this.fileNim);
            formData.append('nim_link', this.fileNim);
        }
        if (this.fileSeprec) {
            console.log('Añadiendo archivo SEPREC:', this.fileSeprec);
            formData.append('seprec_link', this.fileSeprec);
        }
        if (this.fileDocExplotacion) {
            console.log('Añadiendo archivo Doc Explotación:', this.fileDocExplotacion);
            formData.append('doc_explotacion_link', this.fileDocExplotacion);
        }
        if (this.fileRuex) {
            console.log('Añadiendo archivo RUEX:', this.fileRuex);
            formData.append('ruex_link', this.fileRuex);
        }
        if (this.fileResolucion) {
            console.log('Añadiendo archivo Resolución:', this.fileResolucion);
            formData.append('resolucion_min_fundind_link', this.fileResolucion);
        }
        if (this.filePersoneria) {
            console.log('Añadiendo archivo Personería:', this.filePersoneria);
            formData.append('personeria_juridica_link', this.filePersoneria);
        }
        if (this.fileDocCreacion) {
            console.log('Añadiendo archivo Creación Estatal:', this.fileDocCreacion);
            formData.append('doc_creacion_estatal_link', this.fileDocCreacion);
        }
        if (this.fileCi) {
            console.log('Añadiendo archivo CI:', this.fileCi);
            formData.append('ci_link', this.fileCi);
        }
        // Verificar si todos los valores se agregaron correctamente
        console.log("Valores en FormData:");
        formData.forEach((value, key) => console.log(`${key}: ${value}`));
        console.log('ver si hay errores',this.operador.formulario.valid);
        console.log(this.operador.formulario.errors); // Muestra errores a nivel de formulario
        console.log(this.operador.formulario.controls); // Muestra todos los controles
        console.log(this.lista_arrendamiento);
        console.log(this.oficina);
        // Verificar si el formulario es válido antes de enviar

        if (this.operador.formulario.valid) {
            this.operadorService.editaroperator(operador_id,formData).subscribe(
                (data: any) => {
                    console.log("Respuesta del servidor:", data);
                    this.operador_registrado = this.operadorService.handleCrearoperator(data);
                    if (data) {
                        this.notify.success('Guardado Correctamente');
                        this.router.navigate(['/admin/operador/']);
                    }
                    else{
                        this.notify.success('No se realizo la actualizacion correctmente');
                    }
                },
                (error: any) => {
                    this.errorOperator = this.operadorService.handleCrearoperatorError(error);
                    console.log(error);
                    this.status = error.status;
                    this.notify.error(error.message);
                }
            );
        } else {
            // Mostrar todos los errores de validación
            this.getFormValidationErrors(this.operador.formulario);

            // También puedes mostrar los errores en la interfaz de usuario
            this.markAllAsTouched(this.operador.formulario);

            this.notify.error('Revise los datos e intente nuevamente', 'Error con el Registro', {
                timeOut: 2000,
                positionClass: 'toast-top-right'
            });
    }

    }

    private mostrarErrorFormularios(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.get(key);
        control?.markAsTouched(); // Marca como tocado para activar mensajes de error en la vista
        control?.markAsDirty();
        });
    }
    cambioDepartamento(departamento_id:any){
        console.log(departamento_id);

        //this.operador.formulario.value.dl_departamento_id=departamento_id.value;
        let dept:IDepartamento=this.departamento.find(element => element.id === departamento_id.value);
        this.municipiosService.vermunicipios( departamento_id.value.toString()).subscribe(
            (data:any)=>{

            this.municipio=this.municipiosService.handlemunicipio(data);
            this.options = {
                center: latLng(dept.latitud,dept.longitud),
                zoom: 13.5
            };
            if (this.map) {
                this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
              }
          },
          (error:any)=> this.error=this.municipiosService.handleError(error)
        );
    }
    cambioDepartamento1(departamento:any){
        console.log(departamento);
        this.sucursal.departamento_id=departamento.value;
        this.municipiosService.vermunicipios(this.sucursal.departamento_id.toString()).subscribe(
            (data:any)=>{
            this.municipio_sucursal=this.municipiosService.handlemunicipio(data);
          },
          (error:any)=> this.error=this.municipiosService.handleError(error)
        );
    }
    cambioDepartamentoArrendamiento(departamento:any){
        this.arrendamiento.departamento_id=departamento.value.id;
        this.municipiosService.vermunicipios(departamento.value.id.toString()).subscribe(
            (data:any)=>{
            this.municipio_arrendamiento=this.municipiosService.handlemunicipio(data);
            console.log(this.municipio_arrendamiento);
          },
          (error:any)=> this.error=this.municipiosService.handleError(error)
        );
    }
    cambioMunicipio(municipio:any){
         console.log(this.operador.formulario.value.dl_municipio_id=municipio.value);
    }
    cambioMunicipio1(municipio:any){
        this.sucursal.municipio_id=municipio.value.id;
    }
    cambioMunicipioArrendamiento(municipio:any){
        this.arrendamiento.municipio_id=municipio.value.id;
    }
    cambioEstadoArrendamiento(estado:any){
        this.arrendamiento.estado=estado.value;
        console.log(this.arrendamiento);
    }


    cambioTipoSucursal(dependencia_id:any){
        this.sucursal.tipo=this.tipoSucursal.find(element => element.id === dependencia_id.value).name;

        console.log(this.sucursal.tipo);
   }
   cambioEstadoSucursal(dependencia_id:any){
    this.sucursal.estado=dependencia_id.value;

    console.log(dependencia_id.value);
}

    onChangeTipoCreacion(dependencia_id:any){
         this.operador.formulario.value.tipo_doc_creacion=dependencia_id.value.id;
    }
    onChangeExplotacion(dependencia_id:any){
        this.arrendamiento.tipo_explotacion=dependencia_id.value.name;

    }

    onFileSelected(event: any, field: string) {
        console.log('Evento de archivo:', event); // Verifica si el evento se está activando

        if (event.files && event.files.length > 0) {
            const file = event.files[0]; // PrimeNG usa `event.files`
            console.log(`Archivo seleccionado para ${field}:`, file);

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
        } else {
            console.warn(`No se seleccionó ningún archivo para ${field}`);
        }
    }

      options: any;
      satelliteLayer: any;
      standardLayer:any;
      streetLayer:any;
      clickedCoordinates: string = '';
      markerLayer: any;
      tonerLayer:any;
      currentMarker: Marker;
      map: any;

      addMarker(lat: number, lng: number) {
        // Si ya existe un marcador, lo eliminamos
        if (this.currentMarker) {
          this.map.removeLayer(this.currentMarker);
        }

        // Crear y agregar un nuevo marcador
        this.currentMarker = marker([lat, lng]).addTo(this.map);
        this.currentMarker.bindPopup(`Latitud: ${lat}, Longitud: ${lng}`).openPopup();
      }
      // Método que se ejecuta después de la inicialización
  onMapReady(map: Map) {
    this.map = map;

    // Agregar evento de clic en el mapa
    this.map.on('click', (event) => {
      this.addMarker(event.latlng.lat, event.latlng.lng);
    });
  }
  submited:boolean=false;
  mapaDialogo:boolean=false;
    abrirMapa() {
        if(this.operador.formulario.value.dl_departamento_id){
            let dept:any=this.departamento.find(val => val.id ===  this.operador.formulario.value.dl_departamento_id);
            console.log(this.operador.formulario.value.dl_departamento_id);
            if (this.map) {
                this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
            }
            this.sw_mapa=false;
            this.mapaDialogo = true;
        }
        else{
            this.notify.error('Seleccione un departamento para abrir el mapa....','Error al Abrir el Mapa',{timeOut:2000,positionClass: 'toast-bottom-right'});
        }
    }
    abrirMapaSucursal() {
        let dept:any=this.departamento.find(val => val.id === this.sucursal.departamento_id);
        if (this.map) {
            this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
        }
        this.sw_mapa=true;
        this.mapaDialogo = true;
    }
    actualizarMapa() {
        if (this.map) {
          setTimeout(() => {
            this.map.invalidateSize();
          }, 0);
        }
      }
    agregarPunto() {

        if(this.currentMarker!==undefined){
            const position = this.currentMarker.getLatLng();
            if(!this.sw_mapa)
                {
                    this.operador.formulario.patchValue({ofi_lat: position.lat, ofi_lon:position.lng});
                }
                else{
                    this.sucursal.latitud=position.lat;
                    this.sucursal.longitud=position.lng;
                    this.operador.formulario.patchValue({created_at: position.lat, updated_at:position.lng});

                }
                this.mapaDialogo = false;
        }
        else{
            this.notify.error('Seleccione un punto en el mapa para agregar....','Error al Seleccionar un Punto',{timeOut:2000,positionClass: 'toast-bottom-right'});
        }


    }
    validarDireccion():boolean{
        let sw=true;
        return sw;
    }
    agregarDireccion(){
        this.oficina.push({...this.sucursal});
    }
    agregarArrendamiento(){
        this.lista_arrendamiento.push({...this.arrendamiento});
    }
    eliminar(domicilio:IOficina) {
        //this.deleteProductDialog = false;
        this.oficina = this.oficina.filter(val => val.direccion !== domicilio.direccion);
        //this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        //this.product = {};
    }
    verForm(){
        console.log( this.operador.formulario.value);
    }



    codigoUnico(event){
        this.arrendamiento.codigo_unico =parseInt((event.target as HTMLInputElement).value);
    }
    nroCuadricula(event){
        this.arrendamiento.extension =parseInt((event.target as HTMLInputElement).value);
    }
    onChangeTipoExtension(event){
        this.arrendamiento.unidad_extension=event.value.name;
    }
    denominacionAreas(event){
        this.arrendamiento.denominacion_area =(event.target as HTMLInputElement).value;
    }

    sucursalLatitud(event){
        this.sucursal.latitud =(event.target as HTMLInputElement).value;
    }
    sucursalDireccion(event){
        this.sucursal.direccion =(event.target as HTMLInputElement).value;
    }
    sucursalLongitud(event){
        this.sucursal.longitud =(event.target as HTMLInputElement).value;
    }

    valSwitches(event:any){
        console.log(event);
        this.valSwitch=event.checked;
    }

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
    // Método para marcar todos los campos como touched (mostrar errores en UI)
    markAllAsTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control instanceof FormGroup) {
                this.markAllAsTouched(control);
            }
        });
    }

}
