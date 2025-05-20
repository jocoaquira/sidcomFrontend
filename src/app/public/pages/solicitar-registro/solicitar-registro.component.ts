import { ElementRef , Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
    templateUrl: './solicitar-registro.component.html',

})
export class SolicitarRegistroComponent implements OnInit {
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
    tipoExplotacion:any[]=[];
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
        estado:'',
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
      if (filteredData[key] === 0 || filteredData[key] === 1) {
        delete filteredData[key]; // Eliminar las propiedades con 0 o 1
      }
    }

    return filteredData;
  };
    onSubmit() {
        let formData = new FormData();

        // Agregar todos los valores del formulario a formData
        let datos=this.convertBooleansToNumbers(this.operador.formulario.value)
        let datofin=this.removeZeroOneProperties(datos);
       /*Object.keys(datofin).forEach(key => {
            if (datofin[key] !== null && datofin[key] !== undefined) {
                formData.append(key, datofin[key]);
            }
        });*/

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


       /* formData.append('fecha_exp_nim', '2025-12-1');
        formData.append('razon_social','EMPRESA MINDEOR');
        formData.append('nit','543543543');
        formData.append('fecha_exp_seprec', '2025-12-1');*/
        // Convertir fechas al formato adecuado antes de enviarlas
        //formData.set('fecha_exp_nim', this.formatDate(this.operador.formulario.value.fecha_exp_nim));
       // formData.set('fecha_exp_seprec', this.formatDate(this.operador.formulario.value.fecha_exp_seprec));
        //formData.set('vencimiento_ruex', this.formatDate(this.operador.formulario.value.vencimiento_ruex));

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

        // Verificar si el formulario es válido antes de enviar
        if (true) {
            this.operadorService.crearoperator(formData).subscribe(
                (data: any) => {
                    console.log("Respuesta del servidor:", data);
                    this.operador_registrado = this.operadorService.handleCrearoperator(data);
                    if (data) {
                        this.notify.success('Guardado Correctamente');
                    }
                    else{
                        this.notify.success('nada de nada');
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
            this.notify.error('Revise los datos e intente nuevamente', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
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

        //this.operador.formulario.value.dl_departamento=departamento_id.value;
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

        this.municipiosService.vermunicipios(departamento.value.id.toString()).subscribe(
            (data:any)=>{
            this.municipio_arrendamiento=this.municipiosService.handlemunicipio(data);
            console.log(this.municipio_arrendamiento);
          },
          (error:any)=> this.error=this.municipiosService.handleError(error)
        );
    }
    cambioMunicipio(municipio:any){
         console.log(this.operador.formulario.value.dl_municipio=municipio.value);
    }
    cambioMunicipio1(municipio:any){
        this.sucursal.municipio_id=municipio.value.codigo;
    }
    cambioMunicipioArrendamiento(municipio:any){
        this.arrendamiento.municipio_id=municipio.value.codigo;
    }



    cambioTipoSucursal(dependencia_id:any){
        this.sucursal.tipo=this.tipoSucursal.find(element => element.id === dependencia_id.value).name;

        console.log(this.sucursal.tipo);
   }
    onChangeTipoCreacion(dependencia_id:any){
         this.operador.formulario.value.tipo_doc_creacion=dependencia_id.value.id;
    }
    onChangeExplotacion(dependencia_id:any){
        console.log(dependencia_id.value);
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
        if(this.operador.formulario.value.dl_departamento){
            let dept:any=this.departamento.find(val => val.id ===  this.operador.formulario.value.dl_departamento);
            console.log(this.operador.formulario.value.dl_departamento);
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

    onVolver(){
        this.router.navigate(['/auth']);
      }
}
