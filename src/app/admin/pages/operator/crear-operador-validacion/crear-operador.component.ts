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
    templateUrl: './crear-operador.component.html',

})
export class CrearOperadorComponent implements OnInit {
    es: any;

    public operador=new OperatorFormulario();
    public errorOperator:any={};
    public operador_registrado!:IOperator;
    @ViewChild('fileUpload') fileUpload: FileUpload;
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
        longitud:''
    };
    errorSucursal:IOficina={
        id:null,
        operator_id:null,
        departamento_id:null,
        municipio_id:null,
        tipo:null,
        direccion:null,
        latitud:null,
        longitud:null
    };
    arrendamiento:IArrendamiento={
        id:null,
        operator_id:null,
        codigo_unico:null,
        nro_cuadricula:null,
        denominacion_areas:'',
        municipio_id:null,
        tipo_explotacion:null
    };
    errorArrendamiento:IArrendamiento={
        id:null,
        operator_id:null,
        codigo_unico:null,
        nro_cuadricula:null,
        denominacion_areas:null,
        municipio_id:null,
        tipo_explotacion:null
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
    onSubmit(){
        let formData = { ...this.operador.formulario.value };

    // Convertir las fechas al formato correcto
        formData.fecha_exp_nim = this.formatDate(formData.fecha_exp_nim);
        formData.fecha_exp_seprec = this.formatDate(formData.fecha_exp_seprec);
        formData.vencimiento_ruex = this.formatDate(formData.vencimiento_ruex);
        console.log(formData);
        if (this.operador.formulario.valid)
        {
            this.operadorService.crearoperator(formData).subscribe(
                (data:any) =>
                {
                  this.operador_registrado=this.operadorService.handleCrearoperator(data);

                  if(data.error==null)
                  {
                    this.notify.success('Guardado Correctamente');
                    //this.router.navigate(['admin/operador/ver/'+this.operador.formulario.value.id]);
                  }
                },
                (error:any) =>
                {
                  this.errorOperator=this.operadorService.handleCrearoperatorError(error.data);
                  console.log(error);
                  this.status=error.status;
                  if(this.status=='fail')
                  {
                    this.notify.error('Error...Revise los campos y vuelva a enviar....');
                  }
                }
              );
        }
        else{
             this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

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

    onFileSelect() {
        // Limpiar el archivo seleccionado para permitir la selección del mismo archivo
        setTimeout(() => {
          this.fileUpload.clear();
        }, 0);
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

        let dept:any=this.departamento.find(val => val.id ===  this.operador.formulario.value.dl_departamento);
        console.log(this.operador.formulario.value.dl_departamento);
        if (this.map) {
            this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
        }
        this.sw_mapa=false;
        this.mapaDialogo = true;
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
        this.arrendamiento.nro_cuadricula =parseInt((event.target as HTMLInputElement).value);
    }
    denominacionAreas(event){
        this.arrendamiento.denominacion_areas =(event.target as HTMLInputElement).value;
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
}
