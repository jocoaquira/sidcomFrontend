import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { IMineral } from '@data/mineral.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ITomaDeMuestra } from '@data/toma_de_muestra.metadata';
import { ITomaDeMuestraSimple } from '@data/toma_de_muestra_simple.metadata';
import { ITomaDeMuestraMineral } from '@data/toma_de_muestra_mineral.metadata';
import { ITomaDeMuestraMineralEnvio } from '@data/toma_de_muestra_mineral_envio.metadata';
import { ITomaDeMuestraMunicipioOrigen } from '@data/toma_de_muestra_municipio_origen.metadata';
import { ITomaDeMuestraMunicipioOrigenEnvio } from '@data/toma_de_muestra_municipio_origen_envio.metadata';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';
import { TomaDeMuestraFormulario } from 'src/app/admin/validators/toma-de-muestra';
import { tileLayer, latLng, Marker,marker, MapOptions,Map, LeafletEvent , control } from 'leaflet';
import { IDepartamento } from '@data/departamento.metadata';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { IMunicipio } from '@data/municipio.metadata';
import { ResponsableTMService } from 'src/app/admin/services/toma-de-muestra/responsable-tm.service';
import { IResponsableTM } from '@data/responsable_tm.metadata';
import { ILugarVerificacionTDM } from '@data/lugar_verificacion_tdm.metadata';
import { LugarVerificacionTDMService } from 'src/app/admin/services/lugar_verificacion_tdm.service';
import { PdfTomaDeMuestraService } from 'src/app/admin/services/pdf/toma-de-muestra-pdf.service';

@Component({
  selector: 'app-crear-toma-de-muestra-parcial',
  templateUrl: './crear-toma-de-muestra-parcial.component.html',
  styleUrls: ['./crear-toma-de-muestra-parcial.component.scss']
})
export class CrearTomaDeMuestraParcialComponent implements OnInit {

    public listaUsuarios!:IResponsableTM[];
    public formulario_interno=new TomaDeMuestraFormulario();
    public departamento_id:number=0;
    public municipio_id:number=0;
    public operador_id:number=0;
    public agranel:boolean=false;
    public ensacado:boolean=false;
    public lingotes:boolean=false;
    public sal:boolean=false;
    public otro:boolean=false;
    public listaLugaresVerificacion:ILugarVerificacionTDM[]=[];
    pais_id: number | null = null;  // Guardar el ID del departamento seleccionado
    aduana_id: number | null = null;  // Guardar el ID del departamento seleccionado

    // Variables para gestión de parciales
    public muestraPadreCreada: boolean = false;
    public muestraPadre: any = null;
    public parcialesHijos: any[] = [];
    public operadorIdContext: number | null = null;
    public dialogoAgregarParcial: boolean = false;
    public verDialog: boolean = false;
    public toma_de_muestra_id: number = null;
    public productDialog: boolean = false;
    public isEditMode: boolean = true;
    public tomaDeMuestra: ITomaDeMuestraSimple = {
      id: null,
      nro_formulario: null,
      fecha_hora_tdm: null,
      razon_social: null,
      estado: null,
      fecha_aprobacion: null,
      fecha_firma: null,
      lugar_verificacion: null,
      ubicacion_lat: null,
      ubicacion_lon: null,
      responsable_tdm_id: null,
      operador_id: null,
      created_at: null,
      updated_at: null
    };
    public skipMapInit: boolean = false;
    public pesoRestante: number = 0;
    public camionesRestantes: number = 0;
    public formularioParcialHijo = new TomaDeMuestraFormulario();
    public Math = Math; // Para usar Math.floor en el template

    public dept:IDepartamento={
      longitud:null,
      latitud:null
    };
    departamento_id1: number | null = null;  // Guardar el ID del departamento seleccionado
  municipio_id1: number | null = null;
  // Método que se llama cuando cambia el departamento
  cambioDepartamento1(departamentoId: number): void {
    this.departamento_id1 = departamentoId;
    // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
  }
    cambioPais(paisId: number): void {
        this.pais_id = paisId;
    }
    cambioAduana(aduanaId: number): void {
        this.aduana_id = aduanaId;
    }
    public formulario_Interno_registrado:ITomaDeMuestra=null;
    public operadores!:IOperatorSimple[];
    public minerales!:IMineral[];
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
     public lista_municipios_origen:ITomaDeMuestraMunicipioOrigen[]=[];
     public municipio_origen:ITomaDeMuestraMunicipioOrigen={
        id:null,
        formulario_int_id:null,
        departamento:null,
        municipio:null,
        municipio_id:null
     }
    public valSwitch: boolean = false;
    public operadorIdFromQuery: number | null = null;

      // Definir los pasos para Steps
  steps = [
    { label: '1. Datos Generales', command: (event: any) => this.gotoStep(0)},
    { label: '2. Datos de Mineral y Origen',command: (event: any) => this.gotoStep(1) },
    { label: '3. Datos de Exportación',command: (event: any) => this.gotoStep(2) }
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
        this.formulario_interno.formulario.markAllAsTouched();
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
        // Validar los campos del Paso 1
        valid = this.formulario_interno.formulario.get('operador_id')?.valid && this.formulario_interno.formulario.get('departamento_id')?.valid &&
        this.formulario_interno.formulario.get('municipio_id')?.valid  && this.formulario_interno.formulario.get('ubicacion_lat')?.valid && this.formulario_interno.formulario.get('ubicacion_lon')?.valid &&
        this.formulario_interno.formulario.get('lugar_verificacion')?.valid && this.formulario_interno.formulario.get('fecha_hora_tdm')?.valid && this.formulario_interno.formulario.get('responsable_tdm_id')?.valid;

        break;
      case 1:
        valid =this.lista_municipios_origen.length>0
        break;
      case 2:
        valid = this.formulario_interno.formulario.get('des_tipo')?.valid &&
       (this.formulario_interno.formulario.get('des_comprador')?.valid ||
        this.formulario_interno.formulario.get('des_comprador')?.disabled) &&
       (this.formulario_interno.formulario.get('des_planta')?.valid ||
        this.formulario_interno.formulario.get('des_planta')?.disabled);
        break;
      // Agregar validaciones para otros pasos si es necesario
    }

    return valid;
  }



  constructor(
    private tomaDeMuestrasService:TomaDeMuestraService,
    private responsableTMService:ResponsableTMService,
    private mineralesService:MineralsService,
    private notify:ToastrService,
    private authService:AuthService,
    private lugaresVerificacionTDMService:LugarVerificacionTDMService,
    private confirmationService:ConfirmationService,
    private pdfTomaDemuestra:PdfTomaDeMuestraService,
    private router: Router,
    private route: ActivatedRoute,
    private presentacionService:PresentacionService,
    private municipiosService:MunicipiosService,
    private departamentosService:DepartamentosService,
  ) {

    this.formulario_interno.formulario.patchValue({
        user_id: authService.getUser.id
      });
    this.formulario_interno.formulario.patchValue({
        operador_id: authService.getUser.operador_id
      });

   }

  ngOnInit() {

    const padreIdSnapshotInit = this.getParamNumber('padreId');
    if (!Number.isNaN(padreIdSnapshotInit) && padreIdSnapshotInit > 0) {
      this.skipMapInit = true;
    }


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
    this.lugaresVerificacionTDMService.verlugarverificacionTDMs('hj').subscribe(
        (data:any)=>{
        this.listaLugaresVerificacion=this.lugaresVerificacionTDMService.handlelugarverificacion(data);
      },
      (error:any)=> this.error=this.lugaresVerificacionTDMService.handleError(error));

    this.mineralesService.verminerals('hj').subscribe(
        (data:any)=>{
        this.minerales=this.mineralesService.handlemineral(data);
      },
      (error:any)=> this.error=this.mineralesService.handleError(error));

      this.presentacionService.verpresentacions('hj').subscribe(
        (data:any)=>{
        this.presentaciones=this.presentacionService.handlepresentacion(data);

      },
      (error:any)=> this.error=this.presentacionService.handleError(error));

      const operadorIdSnapshot = this.getParamNumber('operadorId');
      if (!Number.isNaN(operadorIdSnapshot)) {
        this.applyOperadorContext(operadorIdSnapshot);
      }
      const operadorIdResponsable = this.formulario_interno.formulario.value.operador_id ?? this.operadorIdContext;
      if (operadorIdResponsable) {
        this.cargarResponsablesOperador(operadorIdResponsable);
      }
    this.departamentosService.verdepartamentos(this.nombre).subscribe(
      (data:any)=>{
      this.departamento=this.departamentosService.handledepartamento(data);
      // Para asignar todos los valores del formulario (debe incluir todos los campos)
        this.formulario_interno.formulario.get('departamento_id')?.setValue(4);

      // Esperamos un momento para asegurar que el mapa esté listo
      if (!this.skipMapInit) {
        setTimeout(() => {
          this.cambioDepartamentoMapa(4);
        }, 800);
      }

      this.departamento_id = 4;

    },
    (error:any)=> this.error=this.departamentosService.handleError(error)
  );

    this.destinos = [
        { nombre: 'COMPRADOR', id: '1' },
        { nombre: 'PLANTA DE TRATAMIENTO', id: '2' },
    ];
    this.unidades = [
        { nombre: '%', id: '1' },
        { nombre: 'g/TM', id: '2' },
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
    this.formulario_interno.formulario.get('cantidad')?.disable();
    this.formulario_interno.formulario.get('humedad')?.disable();
    this.formulario_interno.formulario.get('merma')?.disable();

    this.formulario_interno.formulario.get('peso_bruto_humedo')?.valueChanges.subscribe(() => {
        this.calcularPesoNeto();
      });
      this.formulario_interno.formulario.get('tara')?.valueChanges.subscribe(() => {
        this.calcularPesoNeto();
      });
      this.formulario_interno.formulario.get('merma')?.valueChanges.subscribe(() => {
        this.calcularPesoNeto();
      });
      this.formulario_interno.formulario.get('humedad')?.valueChanges.subscribe(() => {
        this.calcularPesoNeto();
      });

    const padreIdSnapshot = this.getParamNumber('padreId');
    const operadorIdSnapshotInit = this.getParamNumber('operadorId');
    if (!Number.isNaN(operadorIdSnapshotInit)) {
      this.applyOperadorContext(operadorIdSnapshotInit);
    }
    if (!Number.isNaN(padreIdSnapshot) && padreIdSnapshot > 0) {
      this.cargarMuestraPadrePorId(padreIdSnapshot);
    }

    this.route.queryParams.subscribe(params => {
      const padreId = this.parseParamValue(params['padreId']);
      const operadorId = this.parseParamValue(params['operadorId']);
      if (!Number.isNaN(operadorId)) {
        this.applyOperadorContext(operadorId);
      }
      if (!Number.isNaN(padreId) && padreId > 0) {
        this.cargarMuestraPadrePorId(padreId);
      }
    });
  }

  private applyOperadorContext(operadorId: number): void {
    if (!operadorId || Number.isNaN(operadorId)) {
      return;
    }
    this.operadorIdContext = operadorId;
    this.operadorIdFromQuery = operadorId;
    this.formulario_interno.formulario.patchValue({
      operador_id: operadorId
    });
    this.cargarResponsablesOperador(operadorId);
  }

  private cargarResponsablesOperador(operadorId: number): void {
    this.responsableTMService.verResponsableTMOperador(operadorId.toString()).subscribe(
      (data: any) => {
        this.listaUsuarios = this.responsableTMService.handleusuario(data)
          .filter(usuario => usuario.estado === 'ACTIVO')
          .map(usuario => ({
            ...usuario,
            nombreCompleto: `${usuario.nombre} ${usuario.apellidos}`
          }));
      },
      (error: any) => this.error = this.responsableTMService.handleError(error)
    );
  }

  private getParamNumber(name: string): number {
    const snapshotValue = this.route.snapshot.queryParamMap.get(name);
    const parsedSnapshot = this.parseParamValue(snapshotValue);
    if (!Number.isNaN(parsedSnapshot)) {
      return parsedSnapshot;
    }
    const searchValue = new URLSearchParams(window.location.search).get(name);
    return this.parseParamValue(searchValue);
  }

  private parseParamValue(value: any): number {
    if (value == null) {
      return NaN;
    }
    const parsed = parseInt(value.toString(), 10);
    return Number.isNaN(parsed) ? NaN : parsed;
  }

  isParcialFinalizado(procedimientoParcial: string | null | undefined): boolean {
    if (!procedimientoParcial) {
      return false;
    }
    return procedimientoParcial.startsWith('EMITIDO');
  }

  isAdminUser(): boolean {
    return this.authService.getUser?.operador_id == null;
  }
  cambioDestino(event){
    if(event.value=='COMPRADOR')
    {
      this.formulario_interno.formulario.patchValue({
        des_planta: null
      });
    }
    else{
      {
        this.formulario_interno.formulario.patchValue({
          des_comprador: null
        });
      }
    }

  }
 // Función para calcular el peso neto
 calcularPesoNeto() {
        // Obtener los valores de cada campo individualmente
    const peso_bruto_humedo = this.formulario_interno.formulario.get('peso_bruto_humedo')?.value;
    const tara = this.formulario_interno.formulario.get('tara')?.value;
    const merma = this.formulario_interno.formulario.get('merma')?.value;
    const humedad = this.formulario_interno.formulario.get('humedad')?.value;


    // Validar que los campos necesarios tengan valores
    if (peso_bruto_humedo && tara !== null && merma !== null && humedad !== null) {
      const pesoSinTara = peso_bruto_humedo - tara;
      const pesoConMerma = pesoSinTara * (merma / 100);
      const pesoConHumedad = pesoSinTara *  (humedad / 100);

      // Calcular el peso neto
      let pesoNeto = pesoSinTara*(1-humedad/100)*(1-merma/100);
      this.formulario_interno.formulario.patchValue({
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
                this.formulario_interno.formulario.patchValue({ubicacion_lat: position.lat, ubicacion_lon:position.lng});
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
  if(this.formulario_interno.formulario.value.departamento_id){
      this.dept=this.departamento.find(val => val.id ===  this.formulario_interno.formulario.value.departamento_id);

      if (this.map) {
          this.map.setView(latLng(this.dept.latitud, this.dept.longitud), 13.5);
      }
      this.sw_mapa=false;
      this.mapaDialogo = true;
  }
  else{
      this.notify.error('Seleccione un departamento para abrir el mapa....','Error al Abrir el Mapa',{timeOut:2000,positionClass: 'toast-bottom-right'});
  }
}

cambioLugarVerificacionTDM(event:any){

    this.formulario_interno.formulario.patchValue({
        lugar_verificacion: event.value.lugar,
        ubicacion_lat:event.value.latitud,
        ubicacion_lon:event.value.longitud,
        municipio_id:event.value.municipio_id
      });
}
valSwitches(event:any){

    this.valSwitch=event.checked;
}

  onSubmit(){
      // Primero, asegúrate de que el formulario está listo antes de modificar los datos
      this.formulario_interno.formulario.patchValue({
        estado: 'GENERADO',
        aduana_id:this.aduana_id,
        pais_destino_id:this.pais_id,
        tipo_muestra:'SIN CARACTERIZACION',
        procedimiento_parcial: 'INICIADO',
        total_parcial: this.formulario_interno.formulario.value.peso_neto_total,
        nro_camiones_parcial: this.formulario_interno.formulario.value.nro_camiones,

        fecha_hora_tdm: this.formatFechaCompleta(this.formulario_interno.formulario.value.fecha_hora_tdm)
      });

      console.log(this.formulario_interno.formulario.value);
      console.log(this.formulario_interno.formulario.valid );
      if (this.formulario_interno.formulario.valid) {
        // Obtenemos los valores del formulario
        let formularioEnvio = this.formulario_interno.formulario.value;

        formularioEnvio={
          ...formularioEnvio,
          generar_parcial:true,
          minerales:this.minerales_envio,
          municipio_origen:this.municipio_origen_envio
        }
        console.log(formularioEnvio);
        const humedad = this.formulario_interno.formulario.get('humedad')?.value;
        const merma = this.formulario_interno.formulario.get('merma')?.value;

        // Si la humedad es undefined, asigna 0
        const humedadFinal = (humedad === undefined) ? 0 : humedad;
        const mermaFinal = (merma === undefined) ? 0 : merma;
        // Crear el objeto reducido
        let formularioReducido = {
            //agregados reciente emente
            merma:mermaFinal,
            aduana_id: formularioEnvio.aduana_id,
            pais_destino_id: formularioEnvio.pais_destino_id,
            m03_id: formularioEnvio.m03_id,
            laboratorio: formularioEnvio.laboratorio,
            comprador: formularioEnvio.comprador,
            codigo_analisis: formularioEnvio.codigo_analisis,
            nro_factura_exportacion: formularioEnvio.nro_factura_exportacion,
            nro_parciales: formularioEnvio.nro_parcial,
            generar_parcial:formularioEnvio.generar_parcial,

          operador_id: formularioEnvio.operador_id,
          responsable_tdm_id: formularioEnvio.responsable_tdm_id,
          lugar_verificacion: formularioEnvio.lugar_verificacion,
          ubicacion_lat: formularioEnvio.ubicacion_lat.toString(),
          ubicacion_lon: formularioEnvio.ubicacion_lon.toString(),
          departamento_id: formularioEnvio.departamento_id,
          municipio_id: formularioEnvio.municipio_id,
          lote: formularioEnvio.lote,
          tipo_muestra: formularioEnvio.tipo_muestra,
          total_parcial: formularioEnvio.peso_neto_total,
          peso_neto_parcial: formularioEnvio.peso_neto_parcial,
          procedimiento_parcial: 'INICIADO',
          presentacion_id: formularioEnvio.presentacion_id,
          cantidad: formularioEnvio.cantidad,
          humedad:humedadFinal,
          nro_camiones: formularioEnvio.nro_camiones,
          nro_camiones_parcial: formularioEnvio.nro_camiones,
          peso_neto_total: formularioEnvio.peso_neto_total,
          observaciones: formularioEnvio.observaciones,
          fecha_hora_tdm: formularioEnvio.fecha_hora_tdm,
          minerales: formularioEnvio.minerales.map(mineral => ({
            mineralId: mineral.mineralId,
            ley: mineral.ley,
            unidad: mineral.unidad
          })),
          municipio_origen: formularioEnvio.municipio_origen.map(municipio => ({
            id: municipio.id
          })
        ),
          procedimiento: [] // Si es necesario, mantén el arreglo vacío o ajusta el contenido
        };



        // Ahora puedes enviar el formulario reducido
        this.tomaDeMuestrasService.crearTomaDeMuestra(formularioReducido).subscribe(
          (data: any) => {
            this.formulario_Interno_registrado = this.tomaDeMuestrasService.handleCrearTomaDeMuestra(data);
            if (this.formulario_Interno_registrado !== null) {
              // Guardar la muestra padre y cambiar a vista de gestión
              this.muestraPadre = this.formulario_Interno_registrado;
              this.muestraPadreCreada = true;
              this.notify.success('Muestra Parcial Padre creada exitosamente. Ahora puede agregar los parciales hijos.', 'Creado Correctamente', { timeOut: 3000, positionClass: 'toast-top-right' });
              // Cargar los parciales hijos si existen
              this.cargarParcialesHijos();
            } else {
              this.notify.error('Falló... Revise los campos y vuelva a enviar...', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
            }
          },
          (error: any) => {
            this.error = this.tomaDeMuestrasService.handleCrearTomaDeMuestraError(error.error.data);
            if (error.error.status == 'fail') {
              this.notify.error('Falló... Revise los campos y vuelva a enviar...', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
            }
          }
        );
      } else {
        this.mostrarErrorFormularios(this.formulario_interno);
        this.notify.error('Revise los datos e intente nuevamente', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
      }
  }
  guardar(){

  }


  agregarLey(){
    // Verifica si el formulario tiene datos completos
    let sw:boolean=false;
    if((this.formulario_mineral.unidad=='%' && parseFloat(this.formulario_mineral.ley)<100  && parseFloat(this.formulario_mineral.ley)>0) || (this.formulario_mineral.unidad=='g/TM'&& parseFloat(this.formulario_mineral.ley)>0))
    {
         sw=true;
    }
    else{
        this.notify.error('Revise el campo Ley (no mayor a 100  si unidad es % y si es g/TM mayor a cero)...','Error con el Registro',{timeOut:5000,positionClass: 'toast-bottom-right'});
        return;
    }
    if (this.formulario_mineral.descripcion && this.formulario_mineral.sigla_mineral && this.formulario_mineral.ley && this.formulario_mineral.unidad && sw) {
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
        if (this.municipio_origen.departamento && this.municipio_origen.municipio) {
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


            this.formulario_interno.formulario.value.departamento=departamento_id;
            this.dept=this.departamento.find(element => element.id === departamento_id);
            if (!this.dept) {
                return;
            }
            this.municipiosService.vermunicipios( departamento_id.toString()).subscribe(
                (data:any)=>{

                this.municipio=this.municipiosService.handlemunicipio(data);
                this.options = {
                    center: latLng(this.dept.latitud,this.dept.longitud),
                    zoom: 13.5
                };
                if (this.map) {
                    this.map.setView(latLng(this.dept.latitud, this.dept.longitud), 13.5);
                  }
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
        this.formulario_interno.formulario.value.id_municipio_destino=event;

        this.formulario_interno.formulario.patchValue({
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
            this.formulario_interno.formulario.get('cantidad')?.enable();
        } else {
        this.formulario_interno.formulario.get('cantidad')?.disable();
        this.formulario_interno.formulario.get('cantidad')?.setValue(null);
        }
        if (this.presentacion.merma==1) {
        this.formulario_interno.formulario.get('merma')?.enable();
        } else {
        this.formulario_interno.formulario.get('merma')?.disable();
        this.formulario_interno.formulario.get('merma')?.setValue(0);
        }
        if (this.presentacion.humedad==1) {
        this.formulario_interno.formulario.get('humedad')?.enable();
        } else {
        this.formulario_interno.formulario.get('humedad')?.disable();
        this.formulario_interno.formulario.get('humedad')?.setValue(0);
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
 formatFechaCompleta(fecha: string | Date): string {
  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) {
    throw new Error("Fecha inválida");
  }

  const anio = fechaObj.getFullYear();
  const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
  const dia = String(fechaObj.getDate()).padStart(2, '0');
  const hora = String(fechaObj.getHours()).padStart(2, '0');
  const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
  const segundos = String(fechaObj.getSeconds()).padStart(2, '0');

  let esto=`${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
  // Convierte el string al formato Date
  let fechas = new Date(esto.replace(' ', 'T'));

// Convierte a formato ISO 8601 con el sufijo 'Z' para indicar UTC
  let fechaConvertida = fechas.toISOString();
  return fechaConvertida;
}

// ============= MÉTODOS PARA GESTIÓN DE PARCIALES =============

cargarParcialesHijos() {
  if (!this.muestraPadre || !this.muestraPadre.lote) {
    return;
  }

  // Buscar todas las muestras con el mismo lote y que NO sean generadas con generar_parcial=true
  const operadorId = this.operadorIdContext ?? this.muestraPadre?.operador_id ?? this.authService.getUser.operador_id;
  this.tomaDeMuestrasService.verTomaDeMuestrasOperador(operadorId).subscribe(
    (data: any) => {
      const todasMuestras = data.data || [];
      // Filtrar solo las que tienen el mismo lote y son parciales hijos
      this.parcialesHijos = todasMuestras.filter(m =>
        m.lote === this.muestraPadre.lote &&
        m.operador_id === this.muestraPadre.operador_id &&
        m.id !== this.muestraPadre.id &&
        m.procedimiento_parcial == null
      );
      console.log('[PARCIALES][PADRE]', this.muestraPadre);
      console.log('[PARCIALES][HIJOS]', this.parcialesHijos);
      const totalPadrePeso = Number(this.muestraPadre?.total_parcial ?? this.muestraPadre?.peso_neto_total ?? 0);
      const totalPadreCamiones = Number(this.muestraPadre?.nro_camiones_parcial ?? this.muestraPadre?.nro_camiones ?? 0);
      const hijosAprobados = this.parcialesHijos.filter(hijo => (hijo?.estado || '').trim() === 'APROBADO');
      console.log('[PARCIALES][HIJOS][APROBADOS]', hijosAprobados.map((hijo: any) => ({
        id: hijo.id,
        estado: hijo.estado,
        peso_neto_parcial: hijo.peso_neto_parcial,
        peso_neto_total: hijo.peso_neto_total,
        nro_camiones: hijo.nro_camiones
      })));
      const totalHijosPeso = hijosAprobados.reduce((sum, hijo) => sum + Number(hijo.peso_neto_parcial ?? hijo.peso_neto_total ?? 0), 0);
      const totalHijosCamiones = hijosAprobados.reduce((sum, hijo) => sum + Number(hijo.nro_camiones ?? 0), 0);
      this.pesoRestante = Math.max(0, totalPadrePeso - totalHijosPeso);
      this.camionesRestantes = Math.max(0, totalPadreCamiones - totalHijosCamiones);
      console.log('[PARCIALES][DISPONIBLE]', {
        totalPadrePeso,
        totalHijosPeso,
        pesoRestante: this.pesoRestante,
        totalPadreCamiones,
        totalHijosCamiones,
        camionesRestantes: this.camionesRestantes
      });
    },
    (error: any) => {
      console.error('Error al cargar parciales hijos', error);
    }
  );
}

cargarMuestraPadrePorId(id: number) {
  this.tomaDeMuestrasService.verTomaDeMuestra(id.toString()).subscribe(
    (data: any) => {
      const sample = data?.data ?? data;
      if (!sample) {
        return;
      }
      this.muestraPadre = sample;
      if (!this.operadorIdContext && sample?.operador_id) {
        this.operadorIdContext = sample.operador_id;
      }
      this.muestraPadreCreada = true;
      this.cargarParcialesHijos();
    },
    (error: any) => {
      this.notify.error('No se pudo cargar la muestra padre', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
  );
}

abrirDialogoAgregarParcial() {
  // Resetear formulario hijo y heredar datos del padre
  this.formularioParcialHijo = new TomaDeMuestraFormulario();

  // Pre-llenar campos heredados del padre
  this.formularioParcialHijo.formulario.patchValue({
    user_id: this.authService.getUser.id,
    operador_id: this.muestraPadre.operador_id,
    responsable_tdm_id: this.muestraPadre.responsable_tdm_id,
    lugar_verificacion: this.muestraPadre.lugar_verificacion,
    ubicacion_lat: this.muestraPadre.ubicacion_lat,
    ubicacion_lon: this.muestraPadre.ubicacion_lon,
    departamento_id: this.muestraPadre.departamento_id,
    municipio_id: this.muestraPadre.municipio_id,
    lote: this.muestraPadre.lote, // MISMO LOTE para relacionar
    tipo_muestra: 'SIN CARACTERIZACION',
    presentacion_id: this.muestraPadre.presentacion_id,
    m03_id: this.muestraPadre.m03_id,
    laboratorio: this.muestraPadre.laboratorio,
    comprador: this.muestraPadre.comprador,
    codigo_analisis: this.muestraPadre.codigo_analisis,
    nro_factura_exportacion: this.muestraPadre.nro_factura_exportacion,
    aduana_id: this.muestraPadre.aduana_id,
    pais_destino_id: this.muestraPadre.pais_destino_id,
    generar_parcial: true, // Hijo tambien se marca como parcial
    estado: 'GENERADO',
    cantidad: this.muestraPadre.cantidad,
    fecha_hora_tdm: new Date() // Fecha/hora actual por defecto
  });

  this.dialogoAgregarParcial = true;
}

crearParcialHijo() {
  if (!this.formularioParcialHijo.formulario.valid) {
    this.notify.error('Complete todos los campos requeridos', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    return;
  }

  // Preparar datos del parcial hijo (similar al onSubmit pero más simple)
  const formValue = this.formularioParcialHijo.formulario.value;

  const pesoHijo = Number(formValue.peso_neto_total) || 0;
  const camionesHijo = Number(formValue.nro_camiones) || 0;

  if (this.pesoRestante <= 0) {
    this.notify.error('No hay peso disponible en el parcial padre', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    return;
  }
  if (pesoHijo > this.pesoRestante) {
    this.notify.error('El peso del parcial excede el peso disponible', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    return;
  }
  if (this.camionesRestantes <= 0) {
    this.notify.error('No hay camiones disponibles en el parcial padre', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    return;
  }
  if (camionesHijo > this.camionesRestantes) {
    this.notify.error('El numero de camiones excede el disponible', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    return;
  }

  const parcialHijoData = {
    operador_id: formValue.operador_id,
    responsable_tdm_id: formValue.responsable_tdm_id,
    lugar_verificacion: formValue.lugar_verificacion,
    ubicacion_lat: formValue.ubicacion_lat.toString(),
    ubicacion_lon: formValue.ubicacion_lon.toString(),
    departamento_id: formValue.departamento_id,
    municipio_id: formValue.municipio_id,
    lote: formValue.lote, // MISMO LOTE del padre
    tipo_muestra: 'SIN CARACTERIZACION',
    presentacion_id: formValue.presentacion_id,
    nro_camiones: formValue.nro_camiones || 1,
    nro_camiones_parcial: this.muestraPadre?.nro_camiones_parcial ?? this.muestraPadre?.nro_camiones,
    peso_neto_total: formValue.peso_neto_total,
    peso_neto_parcial: formValue.peso_neto_total,
    humedad: formValue.humedad || 0,
    merma: formValue.merma || 0,
    observaciones: formValue.observaciones || '',
    fecha_hora_tdm: this.formatFechaCompleta(formValue.fecha_hora_tdm),
    m03_id: formValue.m03_id,
    laboratorio: formValue.laboratorio,
    comprador: formValue.comprador,
    codigo_analisis: formValue.codigo_analisis,
    nro_factura_exportacion: formValue.nro_factura_exportacion,
    aduana_id: formValue.aduana_id,
    pais_destino_id: formValue.pais_destino_id,
    generar_parcial: true,
    procedimiento_parcial: null,
    minerales: this.muestraPadre.minerales || [],
    municipio_origen: (this.muestraPadre.municipio_origen || []).map((municipio: any) => ({
      id: municipio?.id ?? municipio?.municipioId
    })),
    procedimiento: []
  };

  this.tomaDeMuestrasService.crearTomaDeMuestra(parcialHijoData).subscribe(
    (data: any) => {
      const parcialCreado = this.tomaDeMuestrasService.handleCrearTomaDeMuestra(data);
      if (parcialCreado) {
        this.notify.success('Parcial hijo agregado exitosamente', 'Éxito', { timeOut: 2500, positionClass: 'toast-top-right' });
        this.dialogoAgregarParcial = false;
        this.cargarParcialesHijos(); // Recargar lista
      }
    },
    (error: any) => {
      this.notify.error('Error al crear parcial hijo', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
  );
}

solicitarMuestraPadre() {
  this.tomaDeMuestrasService.solicitarTomaDeMuestra(this.muestraPadre.id).subscribe(
    (data: any) => {
      this.muestraPadre.estado = 'SOLICITADO';
      this.notify.success('Muestra parcial padre solicitada para aprobación', 'Éxito', { timeOut: 2500, positionClass: 'toast-top-right' });
    },
    (error: any) => {
      this.notify.error('Error al solicitar muestra padre', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
  );
}

actualizarMuestraPadre() {
  if (!this.muestraPadre?.id) {
    return;
  }

  this.tomaDeMuestrasService.verTomaDeMuestra(this.muestraPadre.id.toString()).subscribe(
    (data: any) => {
      const updated = data?.data ?? data;
      this.muestraPadre = { ...this.muestraPadre, ...updated };
      if (this.muestraPadre?.estado === 'APROBADO' || this.muestraPadre?.estado === 'FIRMADO') {
        this.cargarParcialesHijos();
      }
    },
    (error: any) => {
      this.notify.error('No se pudo actualizar el estado', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
  );
}


solicitarParcial(parcial: any) {
  this.tomaDeMuestrasService.solicitarTomaDeMuestra(parcial.id).subscribe(
    (data: any) => {
      this.notify.success('Parcial solicitado para aprobación', 'Éxito', { timeOut: 2000, positionClass: 'toast-top-right' });
      this.cargarParcialesHijos();
    },
    (error: any) => {
      this.notify.error('Error al solicitar parcial', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
  );
}


confirmarSolicitudParcial(parcial: any) {
  this.confirmationService.confirm({
    key: 'confirm1',
    message: 'Estas seguro de Solicitar la Muestra Parcial: ' + parcial.nro_formulario + '?',
    accept: () => {
      this.solicitarParcial(parcial);
    },
  });
}

abrirEmisionParcial(parcial: ITomaDeMuestraSimple) {
  this.tomaDeMuestra = parcial;
  this.isEditMode = true;
  this.productDialog = true;
}

firmarParcial(parcial: any) {
  this.tomaDeMuestrasService.firmarTomaDeMuestra(parcial.id).subscribe(
    (data: any) => {
      this.cargarParcialesHijos();
    },
    (error: any) => {
      this.notify.error('Error al aprobar parcial', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
  );
}

confirmarAprobacionParcial(parcial: any) {
  this.confirmationService.confirm({
    key: 'confirm1',
    message: 'Estas seguro de Aprobar la Muestra Parcial: ' + parcial.nro_formulario + '?',
    accept: () => {
      this.firmarParcial(parcial);
    },
  });
}

generarPDFParcial(parcial: any) {
  this.tomaDeMuestrasService.verTomaDeMuestraPDF(parcial.id.toString()).subscribe(
    (data: any) => {
      const tdm = this.tomaDeMuestrasService.handleTomaDeMuestraPDF(data);
      this.pdfTomaDemuestra.generarPDF(tdm);
    },
    (error: any) => {
      this.notify.error('Error al generar PDF', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
  );
}


verSolicitud(parcial: any) {
  this.toma_de_muestra_id = parcial.id;
  this.verDialog = true;
}

cerrar(event: any) {
  this.verDialog = event;
}

cerrarDialogoEmision(event: any) {
  this.productDialog = event;
  this.cargarParcialesHijos();
}

volverAFormulario() {
  this.muestraPadreCreada = false;
  this.muestraPadre = null;
  this.parcialesHijos = [];
  this.router.navigate(['/public/toma-de-muestra']);
}

}
