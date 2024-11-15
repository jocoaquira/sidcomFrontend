import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IOperator } from '@data/operator.metadata';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { CountryService } from 'src/app/demo/service/country.service';
import { tileLayer, latLng, Marker,marker, MapOptions,Map, LeafletEvent , control } from 'leaflet';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { IDepartamento } from '@data/departamento.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IOficina } from '@data/oficina.metadata';
import { IArrendamiento } from '@data/arrendamiento.metadata';
@Component({
    templateUrl: './crear-operador.component.html',

})
export class CrearOperadorComponent implements OnInit {

    es: any;



    @ViewChild('fileUpload') fileUpload: FileUpload;
    countries: any[] = [];

    nimniar: any[];
    tipoOperador: any[]=[];
    tipoCreacion:any[]=[];
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

    public errorOperator={
        id:null,
        razon_social:null,
       act_ben_concentracion:null,
       act_comer_externa:null,
       act_comer_interna:null,
       act_exploracion:null,
       act_explotacion:null,
       act_fundicion:null,
       act_tostacion:null,
       act_calcinacion:null,
       act_industrializacion:null,
       act_refinacion:null,
       act_tras_colas:null,
        denominacion_area:null,
        dl_departamento:null,
        dl_direccion:null,
        dl_municipio:null,
        dl_ubicacion:null,
        doc_creacion:null,
        fecha_exp_nim:null,
        fecha_exp_seprec:null,
        municipio_origen:null,
        nro_codigo_unico:null,
        nro_cuadricula:null,
        nro_matricula_seprec:null,
        nro_nim:null,
        nro_personeria:null,
        nro_res_ministerial:null,
        nro_ruex:null,
        vencimiento_ruex:null,
        correo_inst:null,
        ofi_lat:null,
        ofi_lon:null,
        fax_op_min:null,
        tel_fijo:null,
        celular:null,
        otro_celular:null,
        tipo_doc_creacion:null,
        tipo_explotacion:null,
        tipo_operador:null,
        verif_cert_liberacion:null,
        nit:null,
        nim_niar:null,
        fecha_creacion:null,
        fecha_actualizacion:null,
        fecha_expiracion:null,
        estado:null,
        verificacion_toma_muestra:null,
        comercio_interno_coperativa:null,
        traslado_colas:null,
        transbordo:null,
        nit_link:null,
        nim_link:null,
        seprec_link:null,
        doc_explotacion_link:null,
        ruex_link:null,
        resolucion_min_fundind_link:null,
        personeria_juridica_link:null,
        doc_creacion_estatal_link:null,
        ci_link:null,
        rep_nombre_completo:null,
        rep_ci:null,
        rep_departamento_id:null,
        rep_municipio_id:null,
        rep_direccion:null,
        rep_telefono:null,
        rep_celular:null,
        rep_correo:null,
        observaciones:null,

    }
    public form:IOperator={
        id:null,
        razon_social:'',
       act_ben_concentracion:null,
       act_comer_externa:null,
       act_comer_interna:null,
       act_exploracion:null,
       act_explotacion:null,
       act_fundicion:null,
       act_tostacion:null,
       act_calcinacion:null,
       act_industrializacion:null,
       act_refinacion:null,
       act_tras_colas:null,
        denominacion_area:'',
        dl_departamento:null,
        dl_direccion:'',
        dl_municipio:null,
        dl_ubicacion:'',
        doc_creacion:'',
        fecha_exp_nim:'',
        fecha_exp_seprec:'',
        municipio_origen:'',
        nro_codigo_unico:'',
        nro_cuadricula:'',
        nro_matricula_seprec:'',
        nro_nim:'',
        nro_personeria:'',
        nro_res_ministerial:null,
        nro_ruex:'',
        vencimiento_ruex:'',
        correo_inst:'',
        ofi_lat:'',
        ofi_lon:'',
        fax_op_min:'',
        tel_fijo:'',
        celular:null,
        otro_celular:null,
        tipo_doc_creacion:null,
        tipo_explotacion:null,
        tipo_operador:null,
        verif_cert_liberacion:null,
        nit:null,
        nim_niar:null,
        fecha_creacion:'',
        fecha_actualizacion:'',
        fecha_expiracion:'',
        estado:null,
        verificacion_toma_muestra:null,
        comercio_interno_coperativa:null,
        traslado_colas:null,
        transbordo:null,
        nit_link:'',
        nim_link:'',
        seprec_link:'',
        doc_explotacion_link:'',
        ruex_link:'',
        resolucion_min_fundind_link:'',
        personeria_juridica_link:'',
        doc_creacion_estatal_link:'',
        ci_link:'',
        rep_nombre_completo:'',
        rep_ci:'',
        rep_departamento_id:null,
        rep_municipio_id:null,
        rep_direccion:'',
        rep_telefono:null,
        rep_celular:null,
        rep_correo:'',
        observaciones:'',
    }


    selectedCountryAdvanced: any[] = [];

    valSlider = 50;

    valColor = '#424242';

    valRadio: string = '';

    valCheck: string[] = [];

    valCheck2: boolean = false;

    valSwitch: boolean = false;

    selectedList: SelectItem = { value: '' };

    selectedDrop: SelectItem = { value: '' };

    selectedMulti: any[] = [];

    valToggle = false;

    paymentOptions: any[] = [];

    valSelect1: string = "";

    valSelect2: string = "";

    valueKnob = 20;

    constructor(
        private operadorService:OperatorsService,
        private notify:ToastrService,
        private router:Router,
        private municipiosService:MunicipiosService,
        private departamentosService:DepartamentosService,
    ) {
        this.nimniar = [
            {name: 'NIM', code: '1'},
            {name: 'NIAR', code: '2'},
        ];
        this.tipoOperador = [
            {name: 'EMPRESA PRIVADA', code: '3'},
            {name: 'COOPERATIVA', code: '1'},
            {name: 'EMPRESA ESTATAL', code: '2'},
        ];
        this.tipoCreacion = [
            {name: 'LEY', code: '1'},
            {name: 'DECRETO SUPREMO', code: '2'},
            {name: 'RESOLUCION MINISTERIAL', code: '3'},
        ];
        this.tipoExplotacion = [
            {name: 'PATENTE MINERA', code: '1'},
            {name: 'CONTRATO DE ARRENDAMIENTO', code: '2'}
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

    onSubmitOperador(regisForm:NgForm) {
        this.operadorService.crearoperator(regisForm.value).subscribe(
          (data:any) =>
          {
            this.form=this.operadorService.handleCrearoperator(data.data);
            this.status=data.status;
            if(this.status=='success')
            {
              this.notify.success('Guardado Correctamente');
              this.router.navigate(['admin/operador/ver/'+this.form.id]);
            }
          },
          (error:any) =>
          {
            this.errorOperator=this.operadorService.handleCrearoperatorError(error.error.data);
            this.status=error.error.status;
            if(this.status=='fail')
            {
              this.notify.error('Error...Revise los campos y vuelva a enviar....');
            }
          }
        );
    }
    onChangeActorProductivo(dependencia_id:any){
        this.form.tipo_operador=dependencia_id.code;
    }
    cambioDepartamento(departamento:any){
        this.form.dl_departamento=departamento.value.id;
        this.municipiosService.vermunicipios(this.form.dl_departamento.toString()).subscribe(
            (data:any)=>{
                console.log(data);
            this.municipio=this.municipiosService.handlemunicipio(data);

            this.options = {
                center: latLng(departamento.value.latitud,departamento.value.longitud),
                zoom: 13.5
            };
            if (this.map) {
                this.map.setView(latLng(departamento.value.latitud, departamento.value.longitud), 13.5);
              }
          },
          (error:any)=> this.error=this.municipiosService.handleError(error)
        );
    }
    cambioDepartamento1(departamento:any){
        this.sucursal.departamento_id=departamento.value.id;
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
        this.form.dl_municipio=municipio.value.codigo;
    }
    cambioMunicipio1(municipio:any){
        this.sucursal.municipio_id=municipio.value.codigo;
    }
    cambioMunicipioArrendamiento(municipio:any){
        this.arrendamiento.municipio_id=municipio.value.codigo;
    }


    onChangeNimNiar(dependencia_id:any){
        this.form.nim_niar=dependencia_id.value.code;
    }
    onChangeTipoCreacion(dependencia_id:any){
        this.form.tipo_doc_creacion=dependencia_id.value.code;
    }
    onChangeExplotacion(dependencia_id:any){
        console.log(dependencia_id.value.code);
        this.arrendamiento.tipo_explotacion=dependencia_id.value.code;
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

        let dept:any=this.departamento.find(val => val.id === this.form.dl_departamento);
        console.log(dept);
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
            this.form.ofi_lat=position.lat;
            this.form.ofi_lon=position.lng;
        }
        else{
            this.sucursal.latitud=position.lat;
            this.sucursal.longitud=position.lng;
        }
        this.mapaDialogo = false;
         // Si ya existe un marcador, lo eliminamos
         if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
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
        console.log(this.form);
    }

    act_ben_concentracion:number=0;
    act_comer_externa:number=0;
    act_comer_interna:number=0;
    act_exploracion:number=0;
    act_explotacion:number=0;
    act_fundicion:number=0;
    act_industrializacion:number=0;
    act_refinacion:number=0;
    act_tras_colas:number=0;
    onIndustrializacion(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_industrializacion=1;
        }
        else{
            this.form.act_industrializacion=0;
        }
    }
    onComerInterna(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_comer_interna=1;
        }
        else{
            this.form.act_comer_interna=0;
        }
    }
    onExploracion(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_exploracion=1;
        }
        else{
            this.form.act_exploracion=0;
        }
    }
    onTrasColas(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_tras_colas=1;
        }
        else{
            this.form.act_tras_colas=0;
        }
    }
    onConcentracion(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_ben_concentracion=1;
        }
        else{
            this.form.act_ben_concentracion=0;
        }
    }
    onRefinacion(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_refinacion=1;
        }
        else{
            this.form.act_refinacion=0;
        }
    }
    onComerExterna(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_comer_externa=1;
        }
        else{
            this.form.act_comer_externa=0;
        }
    }
    onExplotacion(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_explotacion=1;
        }
        else{
            this.form.act_explotacion=0;
        }
    }
    onFundicion(event: any) {
        if(event.checked.length > 0)
        {
            this.form.act_fundicion=1;
        }
        else{
            this.form.act_fundicion=0;
        }
        this.verForm();
    }
}
