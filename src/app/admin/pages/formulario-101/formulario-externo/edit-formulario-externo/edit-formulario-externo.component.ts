import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { IChofer } from '@data/chofer.metadata';
import { IDepartamento } from '@data/departamento.metadata';
import { IFormularioExternoMineral } from '@data/form_ext_mineral.metadata';
import { IFormularioExternoMineralEnvio } from '@data/form_ext_mineral_envio.metadata';
import { IFormularioExternoMunicipioOrigen } from '@data/form_ext_municipio_origen.metadata';
import { IFormularioExternoMunicipioOrigenEnvio } from '@data/form_ext_municipio_origen_envio.metadata';
import { IFormularioExterno } from '@data/formulario_externo.metadata';
import { IMineral } from '@data/mineral.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ITDMNroForm } from '@data/toma_de_muestra_nroform.metadata';
import { IVehiculo } from '@data/vehiculo.metadata';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, retry } from 'rxjs';
import { CanCrearTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-crear-toma-de-muestra.guard';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { FormularioExternoMineralService } from 'src/app/admin/services/formulario-externo/formularioexterno-mineral.service';
import { FormularioExternoMunicipioOrigenService } from 'src/app/admin/services/formulario-externo/formularioexterno-municipioorigen.service';
import { FormularioExternosService } from 'src/app/admin/services/formulario-externo/formulariosexternos.service';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { TipoTransporteService } from 'src/app/admin/services/tipo-transporte.service';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';
import { FormularioExternoFormulario } from 'src/app/admin/validators/formulario-externo';

@Component({
  selector: 'app-edit-formulario-externo',
  templateUrl: './edit-formulario-externo.component.html',
  styleUrls: ['./edit-formulario-externo.component.scss']
})
export class EditFormularioExternoComponent implements OnInit {
  public id:number=null;
  public num_form!:any;
  public formulario_externo=new FormularioExternoFormulario(this.canCrearActaTomaDeMuestra,this.tipoTransporteService);
  public departamento_id:number=0;
  public municipio_id:number=0;
  public operador_id:number | null = null;
  public placa:string='';
  public nro_licencia:string='';
  public chofer:IChofer | null = null; // ID del chofer seleccionado
  public vehiculo:IVehiculo | null = null; // ID del vehiculo seleccionado
  public declaracionJurada:boolean=false;
  //public minerales:IMineral[]=[];
  public acta_TDM:ITDMNroForm=null;
 public pais_id1: number | null = null;  // Guardar el ID del departamento seleccionado
 public aduana_id1: number | null = null;

  public formulario_Interno_registrado:IFormularioExterno=null;
  public operadores!:IOperatorSimple[];
  public minerales!:IMineral[];
  public municipios: IMunicipio[] = [];
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
  public error!:any;
  public nombre:string='';
  public lista_leyes_mineral:IFormularioExternoMineral[]=[];
  public formulario_mineral:IFormularioExternoMineral={
      id:null,
      formulario_ext_id:null,
      sigla_mineral:'',
      descripcion:'',
      ley:'',
      unidad:''
   };
   public minerales_envio:any=[];
   public municipio_origen_envio:any=[];
   public lista_municipios_origen:IFormularioExternoMunicipioOrigen[]=[];
   public municipio_origen:IFormularioExternoMunicipioOrigen={
      id:null,
      formulario_ext_id:null,
      departamento:null,
      municipio:null,
      municipio_id:null
   }

    // Definir los pasos para Steps
steps = [
  { label: '1. Datos del Medio de Transporte y Exportación', command: (event: any) => this.gotoStep(0)},
  { label: '2. Datos del mineral y/o Metal',command: (event: any) => this.gotoStep(1) },
  { label: '3. Destino del mineral y/o Metal', command: (event: any) => this.gotoStep(2) }
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
      this.formulario_externo.formulario.markAllAsTouched();
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
        const tipoTransporte = this.formulario_externo.formulario.get('tipo_transporte')?.value;

  // Validaciones básicas existentes
        valid = this.formulario_externo.formulario.get('operador_id')?.valid &&
          this.formulario_externo.formulario.get('m03_id')?.valid &&
          this.formulario_externo.formulario.get('nro_factura_exportacion')?.valid &&
          this.formulario_externo.formulario.get('laboratorio')?.valid &&
          this.formulario_externo.formulario.get('codigo_analisis')?.valid &&
          ((this.formulario_externo.formulario.get('nro_formulario_tm')?.valid && this.acta_TDM != null) ||
           this.formulario_externo.formulario.get('nro_formulario_tm')?.disabled) &&
          // Tipo de transporte es obligatorio
          this.formulario_externo.formulario.get('tipo_transporte')?.valid &&
          // Validaciones condicionales según el tipo de transporte
          (
            // Si es VIA FERREA, validar campos de tren
            tipoTransporte === 'VIA FERREA' ? (
              this.formulario_externo.formulario.get('empresa_ferrea')?.valid !== false &&
              this.formulario_externo.formulario.get('nro_vagon')?.valid !== false &&
              this.formulario_externo.formulario.get('fecha_ferrea')?.valid !== false &&
              this.formulario_externo.formulario.get('hr_ferrea')?.valid !== false
            ) :
            // Si es VIA AEREA, no hay campos adicionales requeridos (por ahora)
            tipoTransporte === 'VIA AEREA' ? true :
            // Para otros tipos de transporte, validar campos de vehículo
            (
              this.formulario_externo.formulario.get('placa')?.valid !== false &&
              this.formulario_externo.formulario.get('nom_conductor')?.valid !== false &&
              this.formulario_externo.formulario.get('licencia')?.valid !== false
            )
          );
          break;
    case 1:
      valid =this.lista_municipios_origen.length>0
      break;
    case 2:
      valid = this.formulario_externo.formulario.get('aduana_id')?.valid &&
     (this.formulario_externo.formulario.get('comprador')?.valid) &&
     (this.formulario_externo.formulario.get('pais_destino_id')?.valid);
      break;
    // Agregar validaciones para otros pasos si es necesario
  }

  return valid;
}

constructor(
  private canCrearActaTomaDeMuestra:CanCrearTomaDeMuestraGuard,
  private operadoresService:OperatorsService,
  private formularioInternoService:FormularioExternosService,
  private mineralesService:MineralsService,
  private notify:ToastrService,
  private authService:AuthService,
  private listaLeyesMineralesService:FormularioExternoMineralService,
  private listaMunicipiosOrigenService:FormularioExternoMunicipioOrigenService,
  private router: Router,
  private presentacionService:PresentacionService,
  private actRoute:ActivatedRoute,
  private municipiosService:MunicipiosService,
  public departamentosService: DepartamentosService,
  private tomaDeMuestraService:TomaDeMuestraService,
  private tipoTransporteService: TipoTransporteService
) {
  this.actRoute.paramMap.subscribe(params=>{
     this.id=parseInt(params.get('id'));
    this.formularioInternoService.verFormularioExterno(this.id.toString()).subscribe(
      (data:any)=>{
      let formulario_int=data;
      this.num_form=formulario_int.nro_formulario;

      this.cargar_datos(formulario_int);
      this.placa=this.formulario_externo.formulario.value.placa;
      this.nro_licencia=this.formulario_externo.formulario.value.licencia;

    },
    (error:any)=> this.error=this.formularioInternoService.handleError(error));
  });
  this.formulario_externo.formulario.patchValue({
      user_id: authService.getUser.id
    });
 }
cargar_datos(form:any){
  this.formulario_externo.formulario.patchValue({
      id: form.id,
      user_id: form.user_id,
      operador_id: form.operador_id,
      nro_formulario: form.nro_formulario,
      m03_id:form.m03_id,
      nro_factura_exportacion:form.nro_factura_exportacion,
      laboratorio:form.laboratorio,
      codigo_analisis:form.codigo_analisis,
      nro_formulario_tm:form.nro_formulario_tm,
      lote: form.lote,
      presentacion_id: form.presentacion_id,
      cantidad: form.cantidad,
      peso_bruto_humedo: form.peso_bruto_humedo,
      peso_neto: form.peso_neto,
      tara: form.tara,
      humedad: form.humedad,
      merma: form.merma,
      comprador: form.comprador,
      aduana_id: form.aduana_id,
      pais_destino_id: form.pais_destino_id,
      tipo_transporte: form.tipo_transporte,
      placa: form.placa,
      nom_conductor:form.nom_conductor ,
      licencia: form.licencia,
      observaciones: form.observaciones,
      fecha_creacion: form.fecha_creacion,
      fecha_vencimiento: form.fecha_vencimiento,
      justificacion_anulacion: form.justificacion_anulacion,
      nro_vagon: form.nro_vagon,
      empresa_ferrea: form.empresa_ferrea,
      fecha_ferrea: form.fecha_ferrea,
      hr_ferrea: form.hr_ferrea,
      tara_volqueta: form.tara_volqueta,
      traslado_mineral: form.traslado_mineral,
      nro_viajes: form.nro_viajes,
      estado: form.estado
  });
  this.operador_id = form.operador_id ?? null;

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

            let  origen_mun:IFormularioExternoMunicipioOrigen={
              municipio:this.municipios[index].municipio,
              departamento:departamento.nombre,
              municipio_id:this.municipios[index].id,
            }
            this.lista_municipios_origen.push({...origen_mun});
          });

          this.minerales_envio.forEach((item) => {
            let index = this.minerales.findIndex(i => i.id === item.mineralId);
            //let mineral=this.minerales.find(dat=>dat.id===this.minerales[index].id);

            let  origen_min:IFormularioExternoMineral={
              sigla_mineral:this.minerales[index].sigla,
              descripcion:this.minerales[index].nombre,
              ley:item.ley,
              unidad:item.unidad,
              mineral_id:this.minerales[index].id
            }
            this.lista_leyes_mineral.push({...origen_min});
          });
          this.pais_id1=this.formulario_externo.formulario.value.pais_destino_id;
          this.aduana_id1=this.formulario_externo.formulario.value.aduana_id;;
          if(this.formulario_externo.formulario.value.nro_formulario_tm!=null){
            this.cargarNroFormulario(form.nro_formulario_tm);
          }
        }
      );

    });
  });
  const present={
    value:form.presentacion_id
  }
  this.cambioPresentacion(present);
}
ngOnInit() {
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

    },
    (error:any)=> this.error=this.presentacionService.handleError(error));

  this.destinos = [
      { nombre: 'COMPRADOR', id: '1' },
      { nombre: 'PLANTA DE TRATAMIENTO', id: '2' },
  ];
  this.unidades = [
      { nombre: '%', id: '1' },
      { nombre: 'g/TM', id: '2' },
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
  this.formulario_externo.formulario.get('cantidad')?.disable();
  this.formulario_externo.formulario.get('humedad')?.disable();
  this.formulario_externo.formulario.get('merma')?.disable();

  this.formulario_externo.formulario.get('peso_bruto_humedo')?.valueChanges.subscribe(() => {
      this.calcularPesoNeto();
    });
    this.formulario_externo.formulario.get('tara')?.valueChanges.subscribe(() => {
      this.calcularPesoNeto();
    });
    this.formulario_externo.formulario.get('merma')?.valueChanges.subscribe(() => {
      this.calcularPesoNeto();
    });
    this.formulario_externo.formulario.get('humedad')?.valueChanges.subscribe(() => {
      this.calcularPesoNeto();
    });
}

// Función para calcular el peso neto
calcularPesoNeto() {
      // Obtener los valores de cada campo individualmente
  const peso_bruto_humedo = this.formulario_externo.formulario.get('peso_bruto_humedo')?.value;
  const tara = this.formulario_externo.formulario.get('tara')?.value;
  const merma = this.formulario_externo.formulario.get('merma')?.value;
  const humedad = this.formulario_externo.formulario.get('humedad')?.value;


  // Validar que los campos necesarios tengan valores
  if (peso_bruto_humedo && tara !== null && merma !== null && humedad !== null) {
    const pesoSinTara = peso_bruto_humedo - tara;
    const pesoConMerma = peso_bruto_humedo * (merma / 100);
    const pesoConHumedad = peso_bruto_humedo * (humedad / 100);

    // Calcular el peso neto
    let pesoNeto = pesoSinTara - pesoConMerma - pesoConHumedad;
    this.formulario_externo.formulario.patchValue({
      peso_neto: pesoNeto
    });


  }
}
cambioPais(paisId: number): void {
  this.pais_id1 = paisId;
  // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
}
cambioAduana(aduanaId: number): void {
  this.aduana_id1 = aduanaId;
  // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
}

cambioOperador(event:any){
  this.operador_id = event?.value ?? null;
  this.placa = '';
  this.nro_licencia = '';
  this.chofer = null;
  this.vehiculo = null;
  this.formulario_externo.formulario.patchValue({
    placa: null,
    nom_conductor: null,
    licencia: null
  });
}

onSubmit(){

}
guardar(){
  this.formulario_externo.formulario.patchValue({
    aduana_id:this.aduana_id1,
    pais_destino_id:this.pais_id1
  });
  if(this.formulario_externo.formulario.valid){
    let formularioEnvio=this.formulario_externo.formulario.value;
    formularioEnvio={
      ...formularioEnvio,
      minerales:this.minerales_envio,
      municipio_origen:this.municipio_origen_envio
    }

    this.formularioInternoService.editarFormularioExterno(formularioEnvio,this.id).subscribe(
      (data:any) =>
      {
          this.formulario_Interno_registrado=this.formularioInternoService.handleCrearFormularioExterno(data);
        if(this.formulario_Interno_registrado!==null)
        {

          this.formulario_externo.formulario.reset();
          this.notify.success('El el formulario interno se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
          this.router.navigate(['/admin/formulario-101/formulario-externo']);
        }
      },
      (error:any) =>
      {

        this.error=this.formularioInternoService.handleCrearFormularioExternoError(error.error.data);
        if(error.error.status=='fail')
        {
          this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
        }
  } );
  }
  else{
      this.mostrarErrorFormularios(this.formulario_externo);
      this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

 }

}
guardarMinerales(formulario_ext_id:any) {
  this.lista_leyes_mineral.forEach((item) => {

      item.formulario_ext_id=formulario_ext_id;
    this.listaLeyesMineralesService.crearFormularioExternoMineral(item).subscribe((data:any) =>
    {

       this.listaLeyesMineralesService.handleCrearFormularioExternoMineral(data);


      if(data.error==null)
      {
        this.notify.success('Minerales Agregados Correctamente','Creado Correctamente',{timeOut:500,positionClass: 'toast-top-right'});
      }
    },
    (error:any) =>
    {

      this.error=this.listaLeyesMineralesService.handleCrearFormularioExternoMineralError(error.error.data);
      if(error.error.status=='fail')
      {
        this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
    });
  });
}
guardarMunicipiosOrigen(formulario_ext_id:any) {
  this.lista_municipios_origen.forEach((item) => {

      item.formulario_ext_id=formulario_ext_id;
    this.listaMunicipiosOrigenService.crearFormularioExternoMunicipioOrigen(item).subscribe((data:any) =>
    {
       this.listaMunicipiosOrigenService.handleCrearFormularioExternoMunicipioOrigen(data);


      if(data.error==null)
      {
        this.notify.success('Municios Origen Agregados Correctamente','Creado Correctamente',{timeOut:500,positionClass: 'toast-top-right'});
      }
    },
    (error:any) =>
    {

      this.error=this.listaMunicipiosOrigenService.handleCrearFormularioExternoMunicipioOrigenError(error.error.data);
      if(error.error.status=='fail')
      {
        this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
    });
  });
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
          let envio_minerales:IFormularioExternoMineralEnvio={
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
  eliminar(domicilio:IFormularioExternoMineral) {
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
              let envio_origen:IFormularioExternoMunicipioOrigenEnvio={
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
  cambioNombreDepartemento(event){

      this.municipio_origen.departamento=event;
  }
  cambioMunicipio(event){
      this.municipio_id=event;
      this.municipio_origen.municipio_id=event;
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

  eliminarMunicipio(domicilio:IFormularioExternoMunicipioOrigen) {
      this.municipio_origen_envio=this.municipio_origen_envio.filter(val => val.id !== domicilio.municipio_id)
      this.lista_municipios_origen = this.lista_municipios_origen.filter(val => val.municipio_id !== domicilio.municipio_id);

    }
/*
  cambioMunicipio1(event){
      this.municipio_id1=event;
      this.formulario_externo.formulario.value.id_municipio_destino=event;

      this.formulario_externo.formulario.patchValue({
          id_municipio_destino: event
        });
  }*/
  declaracionJuradaSwitch(event:any){
      const checkbox = event.target as HTMLInputElement;
      this.declaracionJurada=checkbox.checked;
  }
  cambioDestino(event){
    if(event.value=='COMPRADOR')
    {
      this.formulario_externo.formulario.patchValue({
        des_planta: null
      });
    }
    else{
      {
        this.formulario_externo.formulario.patchValue({
          des_comprador: null
        });
      }
    }
  }

  cambioPresentacion(event:any){
      this.presentacion=this.presentaciones.filter(val => val.id === event.value)[0];


      if (this.presentacion.cantidad==1) {
          this.formulario_externo.formulario.get('cantidad')?.enable();
      } else {
      this.formulario_externo.formulario.get('cantidad')?.disable();
      this.formulario_externo.formulario.get('cantidad')?.setValue(null);
      }
      if (this.presentacion.merma==1) {
      this.formulario_externo.formulario.get('merma')?.enable();
      } else {
      this.formulario_externo.formulario.get('merma')?.disable();
      this.formulario_externo.formulario.get('merma')?.setValue(0);
      }
      if (this.presentacion.humedad==1) {
      this.formulario_externo.formulario.get('humedad')?.enable();
      } else {
      this.formulario_externo.formulario.get('humedad')?.disable();
      this.formulario_externo.formulario.get('humedad')?.setValue(0);
      }
}
private mostrarErrorFormularios(formGroup: FormularioExternoFormulario): void {
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
cambioVehiculo(event:any){
    this.vehiculo=event;
    this.placa=this.vehiculo.placa;

    this.formulario_externo.formulario.patchValue({
        placa: this.vehiculo.placa,
        tipo_transporte:this.vehiculo.tipo,
        });
}
cambioChofer(event:any){
    this.chofer=event;
    this.nro_licencia=this.chofer.nro_licencia;
    this.formulario_externo.formulario.patchValue({
        nom_conductor: event.nombre_apellidos,
        licencia: event.nro_licencia,
        });
}
cambioNroFormulario(event:any){
  let nro_acta:any=(event.target as HTMLInputElement).value;
  this.acta_TDM=null;
  this.lista_municipios_origen = []; // Resetea la lista
  this.lista_leyes_mineral=[];
  this.minerales_envio=[];
  this.municipio_origen_envio=[];
  this.formulario_externo.formulario.patchValue({
    lote:null,
    presentacion_id:null,
    humedad:0,
  });
  const operadorId = this.operador_id ?? this.authService.getUser.operador_id;
  if (!operadorId) {
    this.notify.error('Seleccione un operador minero antes de buscar el acta','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
    return;
  }
  this.tomaDeMuestraService.verTomaDeMuestraForm(nro_acta,operadorId).subscribe(
    (data:any)=>{
    this.acta_TDM=this.tomaDeMuestraService.handleTomaDeMuestraNroForm(data);
    if(this.acta_TDM)
    {
      this.cargarDatosTDM(this.acta_TDM);
    }
  },
  (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
}
cargarDatosTDM(form:ITDMNroForm){
  this.formulario_externo.formulario.patchValue({
    lote:form.lote,
    presentacion_id:form.presentacion_id,
    humedad:form.humedad,
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
      id: destino.municipio_origen_id,
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
          this.minerales = this.mineralesService.handlemineral(data).filter(mineral => mineral.tipo !== 'COMPUESTO');


          this.municipio_origen_envio.forEach((item) => {
            let index = this.municipios.findIndex(i => i.id === item.id);
            let departamento=this.departamentos.find(dat=>dat.id===this.municipios[index].departamento_id);

            let  origen_mun:IFormularioExternoMunicipioOrigen={
              municipio:this.municipios[index].municipio,
              departamento:departamento.nombre,
              municipio_id:this.municipios[index].id,
            }
            this.lista_municipios_origen.push({...origen_mun});
          });

          this.minerales_envio.forEach((item) => {
            let index = this.minerales.findIndex(i => i.id === item.mineralId);
            //let mineral=this.minerales.find(dat=>dat.id===this.minerales[index].id);

            let  origen_min:IFormularioExternoMineral={
              sigla_mineral:this.minerales[index].sigla,
              descripcion:this.minerales[index].nombre,
              ley:item.ley,
              unidad:item.unidad,
              mineral_id:this.minerales[index].id
            }
            this.lista_leyes_mineral.push({...origen_min});
          });
        }
      );

    });
  });
}
cargarNroFormulario(event:any){
  let nro_acta:any=event;
  this.acta_TDM=null;
  this.lista_municipios_origen = []; // Resetea la lista
  this.lista_leyes_mineral=[];

  this.minerales_envio=[];
  this.municipio_origen_envio=[];

  const operadorId = this.operador_id ?? this.authService.getUser.operador_id;
  if (!operadorId) {
    this.notify.error('Seleccione un operador minero antes de buscar el acta','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
    return;
  }
  this.tomaDeMuestraService.verTomaDeMuestraForm(nro_acta,operadorId).subscribe(
    (data:any)=>{
    this.acta_TDM=this.tomaDeMuestraService.handleTomaDeMuestraNroForm(data);
    if(this.acta_TDM)
    {
      this.cargarDatosTDM(this.acta_TDM);
    }
  },
  (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
}
}

