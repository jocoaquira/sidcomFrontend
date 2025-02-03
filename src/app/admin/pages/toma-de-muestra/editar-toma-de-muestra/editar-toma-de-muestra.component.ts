import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { IMineral } from '@data/mineral.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ITomaDeMuestra } from '@data/toma_de_muestra.metadata';
import { ITomaDeMuestraMineral } from '@data/toma_de_muestra_mineral.metadata';
import { ITomaDeMuestraMineralEnvio } from '@data/toma_de_muestra_mineral_envio.metadata';
import { ITomaDeMuestraMunicipioOrigen } from '@data/toma_de_muestra_municipio_origen.metadata';
import { ITomaDeMuestraMunicipioOrigenEnvio } from '@data/toma_de_muestra_municipio_origen_envio.metadata';
import { ToastrService } from 'ngx-toastr';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { TomaDeMuestraMineralService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra-mineral.service';
import { TomaDeMuestraMunicipioOrigenService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra-municipioorigen.service';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';
import { TomaDeMuestraFormulario } from 'src/app/admin/validators/toma-de-muestra';
import { tileLayer, latLng, Marker,marker, MapOptions,Map, LeafletEvent , control } from 'leaflet';
import { IDepartamento } from '@data/departamento.metadata';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { IMunicipio } from '@data/municipio.metadata';
import { catchError, of, retry } from 'rxjs';


@Component({
  selector: 'app-editar-toma-de-muestra',
  templateUrl: './editar-toma-de-muestra.component.html',
  styleUrls: ['./editar-toma-de-muestra.component.scss']
})
export class EditarTomaDeMuestraComponent implements OnInit {


    public formulario_tdm=new TomaDeMuestraFormulario();
    public departamento_id:number=0;
    public municipio_id:number=0;
    public agranel:boolean=false;
    public ensacado:boolean=false;
    public lingotes:boolean=false;
    public sal:boolean=false;
    public otro:boolean=false;
    public num_form!:any;
    departamento_id1: number | null = null;  // Guardar el ID del departamento seleccionado
  municipio_id1: number | null = null;
  // Método que se llama cuando cambia el departamento
  cambioDepartamento1(departamentoId: number): void {
    this.departamento_id1 = departamentoId;
    console.log(departamentoId);
    this.formulario_tdm.formulario.value.departamento=departamentoId;
            let dept:IDepartamento=this.departamento.find(element => element.id === departamentoId);
            console.log(dept);
            this.options = {
              center: latLng(dept.latitud,dept.longitud),
              zoom: 13.5
            };
            if (this.map) {
                this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
              }
  }
    public formulario_Interno_registrado:ITomaDeMuestra=null;
    public operadores!:IOperatorSimple[];
    public minerales!:IMineral[];
    public departamentos: IDepartamento[] = [];
    public presentaciones!:any;
    public presentacion:any={
        nombre:null,
        id:null,
        humedad:0,
        merma:0,
        cantidad:0
    }
    public tipo_transporte!:any;
    public destinos!:any;
    public unidades!:any;
    public parciales!:any;
    public procedimiento!:any;
    public error!:any;
    public nombre:string='';
    public lista_leyes_mineral:ITomaDeMuestraMineral[]=[];
    public formulario_mineral:ITomaDeMuestraMineral={
        id:null,
        formulario_int_id:null,
        sigla_mineral:'',
        descripcion:'',
        ley:'',
        unidad:''
     };
     public minerales_envio:any=[];
     public municipio_origen_envio:any=[];
     public municipios: IMunicipio[] = [];
     public id:any;
     public lista_municipios_origen:ITomaDeMuestraMunicipioOrigen[]=[];
     public municipio_origen:ITomaDeMuestraMunicipioOrigen={
        id:null,
        formulario_int_id:null,
        departamento:null,
        municipio:null,
        municipio_id:null
     }

      // Definir los pasos para Steps
  steps = [
    { label: '1. Datos Generales', command: (event: any) => this.gotoStep(0)},
    { label: '2. Datos de Mineral y Origen',command: (event: any) => this.gotoStep(1) },
    { label: '3. Procedimiento', command: (event: any) => this.gotoStep(2) }
  ];

  public activeStep: number = 0; // Establecer el paso activo inicial


  onStepChange(event: any): void {

    if (!this.isStepValid(this.activeStep)) {
      event.preventDefault(); // Evita que el paso cambie si no es válido
      alert('Por favor, completa el paso actual.');
    }
  }
// Función para ir al siguiente paso
nextStep() {
    if ((this.activeStep < this.steps.length - 1) && this.isStepValid(this.activeStep)) {
            this.activeStep++;
    }
    else{
        this.formulario_tdm.formulario.markAllAsTouched();
        this.notify.error('Por favor, complete todos los campos','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
    }
  }

  // Función para ir al paso anterior
  prevStep() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  // Función para ir a un paso específico
  gotoStep(index: number) {
    this.activeStep = index;
  }

  // Validar si los campos del paso actual son correctos
  isStepValid(stepIndex: number): boolean {
    let valid = true;
    switch (stepIndex) {
      case 0:
        console.log(valid);
        // Validar los campos del Paso 1
        valid = this.formulario_tdm.formulario.get('operador_id')?.valid && this.formulario_tdm.formulario.get('departamento')?.valid &&
        this.formulario_tdm.formulario.get('municipio_id')?.valid  && this.formulario_tdm.formulario.get('latitud')?.valid && this.formulario_tdm.formulario.get('longitud')?.valid &&
        this.formulario_tdm.formulario.get('lugar_verificacion')?.valid ;
        console.log(valid);
        break;
      case 1:
        valid =this.lista_municipios_origen.length>0
        break;
      case 2:
        valid = this.formulario_tdm.formulario.get('des_tipo')?.valid &&
       (this.formulario_tdm.formulario.get('des_comprador')?.valid ||
        this.formulario_tdm.formulario.get('des_comprador')?.disabled) &&
       (this.formulario_tdm.formulario.get('des_planta')?.valid ||
        this.formulario_tdm.formulario.get('des_planta')?.disabled);
        break;
      // Agregar validaciones para otros pasos si es necesario
    }

    return valid;
  }



  constructor(
    private operadoresService:OperatorsService,
    private tomaDeMuestrasService:TomaDeMuestraService,
    private mineralesService:MineralsService,
    private notify:ToastrService,
    private authService:AuthService,
    private listaLeyesMineralesService:TomaDeMuestraMineralService,
    private listaMunicipiosOrigenService:TomaDeMuestraMunicipioOrigenService,
    private router: Router,
    private presentacionService:PresentacionService,
    private municipiosService:MunicipiosService,
    private departamentosService:DepartamentosService,
    private actRoute:ActivatedRoute,
  ) {
    this.actRoute.paramMap.subscribe(params=>{
      this.id=parseInt(params.get('id'));
     this.tomaDeMuestrasService.verTomaDeMuestra(this.id.toString()).subscribe(
       (data:any)=>{
       let formulario_int=data;
       this.num_form=formulario_int.nro_formulario;
       
       this.cargar_datos(formulario_int);
       console.log(this.formulario_tdm.formulario.value);
       this.formulario_tdm.formulario.get('operador_id')?.disable(); // Para desactivar
       
     },
     (error:any)=> this.error=this.tomaDeMuestrasService.handleError(error));
   });
    this.formulario_tdm.formulario.patchValue({
        user_id: authService.getUser.id
      });
   }

   cargar_datos(form:any){
    this.departamento_id1=form.departamento_id;
    this.municipio_id1=form.municipio_id;
    this.formulario_tdm.formulario.patchValue({
        
        id    :form.user_id,
		    user_id   :form.user_id,
		    operador_id   :form.operador_id,
		    responsable_tdm_id    :form.responsable_tdm_id,
		    responsable_tdm_senarecom_id    :form.responsable_tdm_senarecom_id,
		    responsable_tdm_gador_id    :form.responsable_tdm_gador_id,
		    nro_formulario    :form.nro_formulario,
		    lugar_verificacion    :form.lugar_verificacion,
		    ubicacion_lat   :form.ubicacion_lat,
		    ubicacion_lon   :form.ubicacion_lon,
		    departamento_id   :form.departamento_id,
		    municipio_id    :form.municipio_id,
		    lote    :form.lote,
		    tipo_muestra    :form.tipo_muestra,
		    presentacion    :form.presentacion,
		    cantidad    :form.cantidad,
		    nro_camiones    :form.nro_camiones,
		    total_parcial   :form.total_parcial,
		    peso_neto_total   :form.peso_neto_total,
		    peso_neto_parcial   :form.peso_neto_parcial,
		    observaciones   :form.observaciones,
		    fecha_hora_tdm    :form.fecha_hora_tdm,
		    created_at    :form.created_at,
		    updated_at    :form.updated_at,
		    fecha_aprobacion    :form.fecha_aprobacion,
		    fecha_firma   :form.fecha_firma,
		    justificacion_anulacion   :form.justificacion_anulacion,
		    hash    :form.hash,
		    estado    :form.estado,
    });

    this.minerales_envio=form.minerales//.push({...envio_minerales});
    // Crear una nueva lista excluyendo ciertos campos
      this.minerales_envio = form.minerales.map(mineral => {
        // Devuelve solo los campos necesarios
        return {
          mineralId: mineral.mineralId,
          ley: mineral.ley,
          unidad: mineral.unidad
        };
      });
    
    //this.lista_leyes_mineral.push({...this.formulario_mineral});
    
    this.municipio_origen_envio=form.municipio_origen;
    // Crear una nueva lista excluyendo ciertos campos
    this.municipio_origen_envio = form.municipio_origen.map(destino => {
      // Devuelve solo los campos necesarios
      return {
        id: destino.municipioId,
      };
    });


    this.municipiosService.verTodosMunicipios()
      .pipe(
        catchError((error) => {
          this.error = this.municipiosService.handleError(error);
          this.municipios = [];
    
          return of([]);
        })
      )
      .subscribe((data: any) => {
        this.municipios = this.municipiosService.handlemunicipio(data);
        this.departamentosService.verdepartamentos('ds')
        .pipe(
          catchError((error) => {
            this.error = this.departamentosService.handleError(error);
            this.departamentos = [];
            return of([]);
          })
        )
        .subscribe((data: any) => {
          this.departamentos = this.departamentosService.handledepartamento(data);
          
          this.mineralesService.verminerals('gh')
          .pipe(
            retry(3), // Intenta 3 veces si hay un error
            catchError((error) => {
              this.error = this.mineralesService.handleError(error);
              return of([]); // Retorna un arreglo vacío en caso de error
            })
          )
          .subscribe(
            (data: any) => {
              this.minerales = this.mineralesService.handlemineral(data);
              
              
              this.municipio_origen_envio.forEach((item) => {
                let index = this.municipios.findIndex(i => i.id === item.id);
                let departamento=this.departamentos.find(dat=>dat.id===this.municipios[index].departamento_id);
                
                let  origen_mun:ITomaDeMuestraMunicipioOrigen={
                  municipio:this.municipios[index].municipio,
                  departamento:departamento.nombre,
                  municipio_id:this.municipios[index].id,
                }
                this.lista_municipios_origen.push({...origen_mun});
              }); 
    
              this.minerales_envio.forEach((item) => {
                let index = this.minerales.findIndex(i => i.id === item.mineralId);
                //let mineral=this.minerales.find(dat=>dat.id===this.minerales[index].id);
                
                let  origen_min:ITomaDeMuestraMineral={
                  sigla_mineral:this.minerales[index].sigla,
                  descripcion:this.minerales[index].nombre,
                  ley:item.ley,
                  unidad:item.unidad,
                  mineral_id:this.minerales[index].id
                }
                this.lista_leyes_mineral.push({...origen_min});
              }); 
              this.departamento_id1=this.municipios.find(dat=>dat.id===this.municipio_id1).departamento_id;
                
            }
          );
          
        });
      });
      console.log(this.municipio_origen_envio);
    console.log(this.minerales_envio);
    console.log(this.lista_municipios_origen);
    console.log(this.lista_leyes_mineral);
  }


  ngOnInit() {

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



    this.departamento_id=0;
    this.operadoresService.verOperatorsSimple('hj').subscribe(
        (data:any)=>{
        this.operadores=this.operadoresService.handleOperatorSimple(data);
      },
      (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));
      this.mineralesService.verminerals('hj').subscribe(
        (data:any)=>{
        this.minerales=this.mineralesService.handlemineral(data);
      },
      (error:any)=> this.error=this.mineralesService.handleError(error));
      
      this.presentacionService.verpresentacions('hj').subscribe(
        (data:any)=>{
        this.presentaciones=this.presentacionService.handlepresentacion(data);
        console.log(this.presentaciones);
      },
      (error:any)=> this.error=this.presentacionService.handleError(error));
     /* this.presentaciones = [
        { nombre: 'ENSACADO', id: '1',humedad:1,merma:1,cantidad:1 },
        { nombre: 'LINGOTES', id: '2',humedad:0,merma:0,cantidad:1 },
        { nombre: 'A GRANEL', id: '3',humedad:1,merma:1,cantidad:0 },
        { nombre: 'CATODO DE COBRE', id: '4',humedad:0,merma:0,cantidad:1 },
        { nombre: 'CONTENEDOR CILINDRICO', id: '5',humedad:1,merma:1,cantidad:1 },
        { nombre: 'EMBALADAS', id: '6',humedad:1,merma:1,cantidad:1 },
        { nombre: 'ENVASADO', id: '7',humedad:1,merma:1,cantidad:1 },
        { nombre: 'BROZA', id: '8',humedad:1,merma:1,cantidad:0 },
        { nombre: 'AMALGAMA', id: '9',humedad:0,merma:0,cantidad:1 },
        { nombre: 'GRANALLA', id: '10',humedad:0,merma:0,cantidad:1 },
        { nombre: 'ORO PEPA', id: '11',humedad:0,merma:0,cantidad:1 },
        { nombre: 'SACOS', id: '12',humedad:1,merma:1,cantidad:1 },
        { nombre: 'OTRO', id: '13',humedad:1,merma:1,cantidad:0 }
    ];*/
    this.destinos = [
        { nombre: 'COMPRADOR', id: '1' },
        { nombre: 'PLANTA DE TRATAMIENTO', id: '2' },
    ];
    this.unidades = [
        { nombre: '%', id: '1' },
        { nombre: 'DM', id: '2' },
        { nombre: 'g/TM', id: '3' },
    ];
    this.parciales = [
      { nombre: 'TOTAL', id: '1' },
      { nombre: 'PARCIAL', id: '2' },
  ];

  this.procedimiento = [
    { nombre: 'agranel',
      descripcion: `
      <h6>A GRANEL</h6>
      <ul>
        <li>Verificación del número de camiones conjuntamente con SENARECOM</li>
        <li>Tomar incrementos con sonda tubo</li>
        <li>Homogenización de la submuestra</li>
        <li>Cuarteos consecutivos</li>
        <li>Obtención de muestras finales embolsadas y selladas</li>
        <li>Obtención de una muestra para caracterización del mineral</li>
      </ul>
    `
    , id: '1' },
    { nombre: 'ensacado',
      descripcion: `
      <h6>ENSACADO</h6>
      <ul>
        <li>Verificación del número de camiones conjuntamente con SENARECOM</li>
        <li>Calcular la raíz cuadrada del lote</li>
        <li>Sondeo para obtener la sub-muestra</li>
        <li>Homogenización de la sub-muestra</li>
        <li>Cuarteos consecutivos</li>
        <li>Obtención de muestras finales embolsadas y selladas</li>
        <li>Obtención de una muestra para caracterización del mineral</li>
      </ul>
    `
    , id: '2' },
];


    this.tipo_transporte = [
        { nombre: 'TRAILER', id: '1' },
        { nombre: 'CAMION', id: '2' },
        { nombre: 'VOLQUETA', id: '3' },
        { nombre: 'CAMION CON ACOPLE', id: '4' },
        { nombre: 'VIA FERREA', id: '5' },
        { nombre: 'VIA AEREA', id: '6' },
        { nombre: 'JEEP', id: '7' },
        { nombre: 'FURGONETA BLINDADA', id: '8' },
        { nombre: 'CAMIONETA', id: '9' },
        { nombre: 'VAGONETA', id: '10' },
        { nombre: 'MINIBUS', id: '11' },
        { nombre: 'TAXI', id: '12' },
        { nombre: 'ALZAPATA', id: '13' },
        { nombre: 'FLOTA', id: '14' },
        { nombre: 'TRAILER FURGON', id: '15' }
    ];
    this.formulario_tdm.formulario.get('cantidad')?.disable();
    this.formulario_tdm.formulario.get('humedad')?.disable();
    this.formulario_tdm.formulario.get('merma')?.disable();

    this.formulario_tdm.formulario.get('peso_bruto_humedo')?.valueChanges.subscribe(() => {
        this.calcularPesoNeto();
      });
      this.formulario_tdm.formulario.get('tara')?.valueChanges.subscribe(() => {
        this.calcularPesoNeto();
      });
      this.formulario_tdm.formulario.get('merma')?.valueChanges.subscribe(() => {
        this.calcularPesoNeto();
      });
      this.formulario_tdm.formulario.get('humedad')?.valueChanges.subscribe(() => {
        this.calcularPesoNeto();
      });
  }
  cambioDestino(event){
    if(event.value=='COMPRADOR')
    {
      this.formulario_tdm.formulario.patchValue({
        des_planta: null
      });
    }
    else{
      {
        this.formulario_tdm.formulario.patchValue({
          des_comprador: null
        });
      }
    }
    console.log(event);
  }
 // Función para calcular el peso neto
 calcularPesoNeto() {
        // Obtener los valores de cada campo individualmente
    const peso_bruto_humedo = this.formulario_tdm.formulario.get('peso_bruto_humedo')?.value;
    const tara = this.formulario_tdm.formulario.get('tara')?.value;
    const merma = this.formulario_tdm.formulario.get('merma')?.value;
    const humedad = this.formulario_tdm.formulario.get('humedad')?.value;


    // Validar que los campos necesarios tengan valores
    if (peso_bruto_humedo && tara !== null && merma !== null && humedad !== null) {
      const pesoSinTara = peso_bruto_humedo - tara;
      const pesoConMerma = peso_bruto_humedo * (merma / 100);
      const pesoConHumedad = peso_bruto_humedo * (humedad / 100);

      // Calcular el peso neto
      let pesoNeto = pesoSinTara - pesoConMerma - pesoConHumedad;
      this.formulario_tdm.formulario.patchValue({
        peso_neto: pesoNeto
      });


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
      sw_mapa:boolean=false;
      mapaDialogo:boolean=false;
      departamento:IDepartamento[]=[];
      municipio:IMunicipio[]=[];

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
                this.formulario_tdm.formulario.patchValue({ubicacion_lat: position.lat, ubicacion_lon:position.lng});
            }
            else{
                //this.sucursal.latitud=position.lat;
                //this.sucursal.longitud=position.lng;
                //this.operador.formulario.patchValue({created_at: position.lat, updated_at:position.lng});
    
            }
            this.mapaDialogo = false;
    }
    else{
        this.notify.error('Seleccione un punto en el mapa para agregar....','Error al Seleccionar un Punto',{timeOut:2000,positionClass: 'toast-bottom-right'});
    }
    

}
onMapReady(map: Map) {
  this.map = map;

  // Agregar evento de clic en el mapa
  this.map.on('click', (event) => {
    this.addMarker(event.latlng.lat, event.latlng.lng);
  });
}
addMarker(lat: number, lng: number) {
  // Si ya existe un marcador, lo eliminamos
  if (this.currentMarker) {
    this.map.removeLayer(this.currentMarker);
  }

  // Crear y agregar un nuevo marcador
  this.currentMarker = marker([lat, lng]).addTo(this.map);
  this.currentMarker.bindPopup(`Latitud: ${lat}, Longitud: ${lng}`).openPopup();
}
abrirMapa() {
  console.log(this.formulario_tdm.formulario.value);
  if(this.formulario_tdm.formulario.value.departamento_id){
      let dept:any=this.departamento.find(val => val.id ===  this.formulario_tdm.formulario.value.departamento_id);
      console.log(this.formulario_tdm.formulario.value.departamento_id);
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

  onSubmit(){

  }
  guardar(){
    this.formulario_tdm.formulario.patchValue({
        estado: 'GENERADO'
      });
    if(this.formulario_tdm.formulario.valid){
      let formularioEnvio=this.formulario_tdm.formulario.value;
      formularioEnvio={
        ...formularioEnvio,
        minerales:this.minerales_envio,
        municipio_origen:this.municipio_origen_envio
      }
      console.log(formularioEnvio);
      this.tomaDeMuestrasService.crearTomaDeMuestra(formularioEnvio).subscribe(
        (data:any) =>
        {
            this.formulario_Interno_registrado=this.tomaDeMuestrasService.handleCrearTomaDeMuestra(data);
         
          if(this.formulario_Interno_registrado!==null)
          {
            console.log(this.formulario_Interno_registrado);
            this.formulario_tdm.formulario.reset();
            this.notify.success('El el formulario interno se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
            this.router.navigate(['/admin/formulario-101/formulario-interno']);
          }
          else{
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        },
        (error:any) =>
        {
         
          this.error=this.tomaDeMuestrasService.handleCrearTomaDeMuestraError(error.error.data);
          if(error.error.status=='fail')
          {
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        }
      
        
          );
    }
    else{
        this.mostrarErrorFormularios(this.formulario_tdm);
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

   }
   
  }
  guardarMinerales(formulario_int_id:any) {
    this.lista_leyes_mineral.forEach((item) => {
       
        item.formulario_int_id=formulario_int_id;
      this.listaLeyesMineralesService.crearTomaDeMuestraMineral(item).subscribe((data:any) =>
      {

         this.listaLeyesMineralesService.handleCrearTomaDeMuestraMineral(data);

       
        if(data.error==null)
        {
          this.notify.success('Minerales Agregados Correctamente','Creado Correctamente',{timeOut:500,positionClass: 'toast-top-right'});
        }
      },
      (error:any) =>
      {
       
        this.error=this.listaLeyesMineralesService.handleCrearTomaDeMuestraMineralError(error.error.data);
        if(error.error.status=='fail')
        {
          this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
        }
      });
    });
  }
  guardarMunicipiosOrigen(formulario_int_id:any) {
    this.lista_municipios_origen.forEach((item) => {
       
        item.formulario_int_id=formulario_int_id;
      this.listaMunicipiosOrigenService.crearTomaDeMuestraMunicipioOrigen(item).subscribe((data:any) =>
      {
         this.listaMunicipiosOrigenService.handleCrearTomaDeMuestraMunicipioOrigen(data);

       
        if(data.error==null)
        {
          this.notify.success('Municios Origen Agregados Correctamente','Creado Correctamente',{timeOut:500,positionClass: 'toast-top-right'});
        }
      },
      (error:any) =>
      {
       
        this.error=this.listaMunicipiosOrigenService.handleCrearTomaDeMuestraMunicipioOrigenError(error.error.data);
        if(error.error.status=='fail')
        {
          this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
        }
      });
    });
  }

  agregarLey(){
    // Verifica si el formulario tiene datos completos
    if (this.formulario_mineral.descripcion && this.formulario_mineral.sigla_mineral && this.formulario_mineral.ley && this.formulario_mineral.unidad) {
        // Verifica si el registro ya existe en la lista
        const existe = this.lista_leyes_mineral.some(ley => ley.sigla_mineral === this.formulario_mineral.sigla_mineral);

        if (existe) {
            this.notify.error('Ya existe el registro verifique los datos e intente nuevamente....','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
        }
        else{
            // Si no existe, agrega el registro
            this.notify.success('Agregado Exitosamente','Exito',{timeOut:2000,positionClass: 'toast-bottom-right'});
            let envio_minerales:ITomaDeMuestraMineralEnvio={
                mineralId:this.formulario_mineral.mineral_id,
                ley:this.formulario_mineral.ley,
                unidad:this.formulario_mineral.unidad
            }
            this.minerales_envio.push({...envio_minerales});
            this.lista_leyes_mineral.push({...this.formulario_mineral});
           
        }
    } else {
        this.notify.error('Por favor, complete todos los campos','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
    }
  }
    cambioLey(event:any)
    {
        this.formulario_mineral.ley =(event.target as HTMLInputElement).value;

    }
    cambioUnidad(event:any){
        this.formulario_mineral.unidad=event.value;
    }
    eliminar(domicilio:ITomaDeMuestraMineral) {
      this.minerales_envio=this.minerales_envio.filter(val => val.mineralId !== domicilio.mineral_id)
      this.lista_leyes_mineral = this.lista_leyes_mineral.filter(val => val.sigla_mineral !== domicilio.sigla_mineral);
    }

    agregarMunicipio(){
        if (this.municipio_origen.departamento && this.municipio_origen.municipio && this.municipio_origen.municipio_id) {
            // Verifica si el registro ya existe en la lista
            const existe = this.lista_municipios_origen.some(municipio => municipio.municipio_id === this.municipio_origen.municipio_id);

            if (existe) {
                this.notify.error('Ya existe el registro verifique los datos e intente nuevamente....','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
            }
            else{
                // Si no existe, agrega el registro
                this.notify.success('Agregado Exitosamente','Exito',{timeOut:2000,positionClass: 'toast-bottom-right'});
                let envio_origen:ITomaDeMuestraMunicipioOrigenEnvio={
                  id:this.municipio_origen.municipio_id
                }
                this.municipio_origen_envio.push({...envio_origen});
                this.lista_municipios_origen.push({...this.municipio_origen});
            }
        } else {
            this.notify.error('Por favor, complete todos los campos','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
        }
    }
    cambioDepartamento(event){
        this.departamento_id=event;

    }
    cambioDepartamentoMapa(departamento_id:any){
            console.log(departamento_id);
    
            this.formulario_tdm.formulario.value.departamento=departamento_id.value;
            let dept:IDepartamento=this.departamento.find(element => element.id === departamento_id.value);

            this.options = {
              center: latLng(dept.latitud,dept.longitud),
              zoom: 13.5
            };
            if (this.map) {
                this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
              }

            this.municipiosService.vermunicipios( departamento_id.value.toString()).subscribe(
                (data:any)=>{
    
                this.municipio=this.municipiosService.handlemunicipio(data);
              },
              (error:any)=> this.error=this.municipiosService.handleError(error)
            );
        }
    cambioNombreDepartemento(event){

        this.municipio_origen.departamento=event;
    }
    cambioMunicipio(event){
        this.municipio_id=event;
        this.municipio_origen.municipio_id=event;
    }
    cambioMunicipioMapa(municipio:any){
      console.log(this.formulario_tdm.formulario.value.municipio_id=municipio.value);
 }
    cambioNombreMunicipio(event){
        this.municipio_origen.municipio=event;
    }
    cambioSigla(event){
        this.formulario_mineral.sigla_mineral=event;
    }
    cambioNombreMineral(event){
        this.formulario_mineral.descripcion=event;
    }
    cambioMineralId(event){
        this.formulario_mineral.mineral_id=event;
    }

    eliminarMunicipio(domicilio:ITomaDeMuestraMunicipioOrigen) {
        this.municipio_origen_envio=this.municipio_origen_envio.filter(val => val.id !== domicilio.municipio_id)
        this.lista_municipios_origen = this.lista_municipios_origen.filter(val => val.municipio_id !== domicilio.municipio_id);
    
      }

    cambioMunicipio1(event){
        this.municipio_id1=event;
        this.formulario_tdm.formulario.value.id_municipio_destino=event;

        this.formulario_tdm.formulario.patchValue({
            id_municipio_destino: event
          });
    }
    declaracionJuradaSwitch(event:any){
        const checkbox = event.target as HTMLInputElement;
        //this.lingotes=checkbox.checked;
    }


    cambioPresentacion(event:any){
        this.presentacion=this.presentaciones.filter(val => val.id === event.value)[0];


        if (this.presentacion.cantidad==1) {
            this.formulario_tdm.formulario.get('cantidad')?.enable();
        } else {
        this.formulario_tdm.formulario.get('cantidad')?.disable();
        this.formulario_tdm.formulario.get('cantidad')?.setValue(null);
        }
        if (this.presentacion.merma==1) {
        this.formulario_tdm.formulario.get('merma')?.enable();
        } else {
        this.formulario_tdm.formulario.get('merma')?.disable();
        this.formulario_tdm.formulario.get('merma')?.setValue(0);
        }
        if (this.presentacion.humedad==1) {
        this.formulario_tdm.formulario.get('humedad')?.enable();
        } else {
        this.formulario_tdm.formulario.get('humedad')?.disable();
        this.formulario_tdm.formulario.get('humedad')?.setValue(0);
        }
}
private mostrarErrorFormularios(formGroup: TomaDeMuestraFormulario): void {
    const errores: any[] = [];
  Object.keys(formGroup.formulario.controls).forEach((campo) => {
    const control = formGroup.formulario.get(campo);
    if (control?.errors) {
      const mensajeError =formGroup.getErrorMessage(campo);
      errores.push({ campo, mensajeError });
    }
  });

  if (errores.length > 0) {
   
  } else {
   
  }
}
cancelar(){

}
}
