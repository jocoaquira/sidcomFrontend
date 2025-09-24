import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { IChofer } from '@data/chofer.metadata';
import { IDepartamento } from '@data/departamento.metadata';
import { IFormularioInternoMineral } from '@data/form_int_mineral.metadata';
import { IFormularioInternoMineralEnvio } from '@data/form_int_mineral_envio.metadata';
import { IFormularioInternoMunicipioOrigen } from '@data/form_int_municipio_origen.metadata';
import { IFormularioInternoMunicipioOrigenEnvio } from '@data/form_int_municipio_origen_envio.metadata';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { IMineral } from '@data/mineral.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { IVehiculo } from '@data/vehiculo.metadata';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, retry } from 'rxjs';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { FormularioInternoMineralService } from 'src/app/admin/services/formulario-interno/formulariointerno-mineral.service';
import { FormularioInternoMunicipioOrigenService } from 'src/app/admin/services/formulario-interno/formulariointerno-municipioorigen.service';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { TipoTransporteService } from 'src/app/admin/services/tipo-transporte.service';
import { FormularioInternoFormulario } from 'src/app/admin/validators/formulario-interno';

@Component({
  selector: 'app-edit-formulario-interno',
  templateUrl: './edit-formulario-interno.component.html',
  styleUrls: ['./edit-formulario-interno.component.scss']
})
export class EditFormularioInternoComponent implements OnInit {
  public id:number=null;
  public num_form!:any;
  public formulario_interno: FormularioInternoFormulario;
public departamento_id:number=0;
  public municipio_id:number=0;
  public declaracionJurada:boolean=false;
  //public minerales:IMineral[]=[];

  departamento_id1: number | null = null;  // Guardar el ID del departamento seleccionado
municipio_id1: number | null = null;
// Método que se llama cuando cambia el departamento
cambioDepartamento1(departamentoId: number): void {
  this.departamento_id1 = departamentoId;
  // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
}
  public formulario_Interno_registrado:IFormularioInterno=null;
  public operadores!:IOperatorSimple[];
  public minerales!:IMineral[];
  public municipios: IMunicipio[] = [];
  public operador_id:number=0;
  public placa:string='';
  public nro_licencia:string='';
  public razon_social:string='';
  public chofer:IChofer | null = null; // ID del chofer seleccionado
  public vehiculo:IVehiculo | null = null; // ID del vehiculo seleccionado
  public comprador:IOperatorSimple | null = null; // ID del vehiculo seleccionado
  public valSwitch:boolean=false;
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
  public lista_leyes_mineral:IFormularioInternoMineral[]=[];
  public formulario_mineral:IFormularioInternoMineral={
      id:null,
      formulario_int_id:null,
      sigla_mineral:'',
      descripcion:'',
      ley:'',
      unidad:''
   };
   public minerales_envio:any=[];
   public municipio_origen_envio:any=[];
   public lista_municipios_origen:IFormularioInternoMunicipioOrigen[]=[];
   public municipio_origen:IFormularioInternoMunicipioOrigen={
      id:null,
      formulario_int_id:null,
      departamento:null,
      municipio:null,
      municipio_id:null
   }

    // Definir los pasos para Steps
steps = [
    { label: '1. Medio de Transporte y Mineral y/o Metal ', command: (event: any) => this.gotoStep(0)},
    { label: '2. Origen del mineral y/o Metal',command: (event: any) => this.gotoStep(1) },
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
              // CORRECCIÓN: Separar las validaciones para debugging
      const peso_bruto_valido = this.formulario_interno.formulario.get('peso_bruto_humedo')?.valid;
      const tara_valido = this.formulario_interno.formulario.get('tara')?.valid;
      const lote_valido = this.formulario_interno.formulario.get('lote')?.valid;
      const presentacion_valido = this.formulario_interno.formulario.get('presentacion_id')?.valid;
      const peso_neto_valido = this.formulario_interno.formulario.get('peso_neto')?.valid;

      // Validaciones condicionales para campos que pueden estar deshabilitados
      const merma_valido = this.formulario_interno.formulario.get('merma')?.disabled ||
                          this.formulario_interno.formulario.get('merma')?.valid;
      const humedad_valido = this.formulario_interno.formulario.get('humedad')?.disabled ||
                            this.formulario_interno.formulario.get('humedad')?.valid;
      const cantidad_valido = this.formulario_interno.formulario.get('cantidad')?.disabled ||
                             this.formulario_interno.formulario.get('cantidad')?.valid;

      // Validar que hay al menos un mineral agregado
      const minerales_valido = this.lista_leyes_mineral.length > 0;

      valid = peso_bruto_valido && tara_valido && lote_valido && presentacion_valido &&
              peso_neto_valido && merma_valido && humedad_valido && cantidad_valido &&
              minerales_valido;

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
  private operadoresService:OperatorsService,
  private formularioInternoService:FormularioInternosService,
  private mineralesService:MineralsService,
  private notify:ToastrService,
  private authService:AuthService,
  private listaLeyesMineralesService:FormularioInternoMineralService,
  private listaMunicipiosOrigenService:FormularioInternoMunicipioOrigenService,
  private router: Router,
  private presentacionService:PresentacionService,
  private actRoute:ActivatedRoute,
  private municipiosService:MunicipiosService,
  public departamentosService: DepartamentosService,
  private tipoTransporteService: TipoTransporteService
) {
    this.formulario_interno = new FormularioInternoFormulario(this.tipoTransporteService);
    this.actRoute.paramMap.subscribe(params=>{
        this.id=parseInt(params.get('id'));
        this.operador_id=this.authService.getUser.operador_id;
        this.formularioInternoService.verFormularioInterno(this.id.toString()).subscribe(
        (data:any)=>{
        let formulario_int=data;
        this.num_form=formulario_int.nro_formulario;

        this.cargar_datos(formulario_int);
        this.placa=this.formulario_interno.formulario.value.placa;
        this.nro_licencia=this.formulario_interno.formulario.value.licencia;
        this.formulario_interno.formulario.get('operador_id')?.disable(); // Para desactivar

        },
        (error:any)=> this.error=this.formularioInternoService.handleError(error));
    });

    this.formulario_interno.formulario.patchValue({
        user_id: authService.getUser.id
    });

 }
cargar_datos(form:any){
  this.formulario_interno.formulario.patchValue({
      id: form.id,
      user_id: form.user_id,
      operador_id: form.operador_id,
      nro_formulario: form.nro_formulario,
      lote: form.lote,
      presentacion_id: form.presentacion_id,
      cantidad: form.cantidad,
      departamento_id:form.departamento_id,
      peso_bruto_humedo: form.peso_bruto_humedo,
      peso_neto: form.peso_neto,
      tara: form.tara,
      humedad: form.humedad,
      merma: form.merma,
      municipio_id:form.municipio_id,
      des_tipo: form.des_tipo,
      des_comprador: form.des_comprador,
      des_planta: form.des_planta,
      id_municipio_destino: form.id_municipio_destino,
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

            let  origen_mun:IFormularioInternoMunicipioOrigen={
              municipio:this.municipios[index].municipio,
              departamento:departamento.nombre,
              municipio_id:this.municipios[index].id,
            }
            this.lista_municipios_origen.push({...origen_mun});
          });

          this.minerales_envio.forEach((item) => {
            let index = this.minerales.findIndex(i => i.id === item.mineralId);
            //let mineral=this.minerales.find(dat=>dat.id===this.minerales[index].id);

            let  origen_min:IFormularioInternoMineral={
              sigla_mineral:this.minerales[index].sigla,
              descripcion:this.minerales[index].nombre,
              ley:item.ley,
              unidad:item.unidad,
              mineral_id:this.minerales[index].id
            }
            this.lista_leyes_mineral.push({...origen_min});
          });
          this.municipio_id1=this.formulario_interno.formulario.value.id_municipio_destino;
          this.departamento_id1=this.municipios.find(dat=>dat.id===this.municipio_id1).departamento_id;

        }
      );

    });
  });
}
ngOnInit() {
  this.departamento_id=0;
  this.operadoresService.verOperatorsSimple('hj').subscribe(
      (data:any)=>{
      this.operadores=this.operadoresService.handleOperatorSimple(data);

      const operadorEncontrado = this.operadores.find(operador =>
        operador.razon_social===this.formulario_interno.formulario.value.des_comprador
        );

        if (operadorEncontrado) {

            this.valSwitch=false;
            this.razon_social=operadorEncontrado.razon_social;
        } else {
            this.valSwitch=true;
        }
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

    this.tipoTransporteService.verTipoTransportes('hj').subscribe(
        (data:any)=>{
        this.tipo_transporte=this.tipoTransporteService.handleTipoTransportes(data);
      },
      (error:any)=> this.error=this.tipoTransporteService.handleError(error));

  this.destinos = [
      { nombre: 'COMPRADOR', id: '1' },
      { nombre: 'PLANTA DE TRATAMIENTO', id: '2' },
  ];
  this.unidades = [
      { nombre: '%', id: '1' },
      { nombre: 'g/TM', id: '2' },
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
    const pesoConMerma = peso_bruto_humedo * (merma / 100);
    const pesoConHumedad = peso_bruto_humedo * (humedad / 100);

    // Calcular el peso neto
    let pesoNeto = pesoSinTara - pesoConMerma - pesoConHumedad;
    this.formulario_interno.formulario.patchValue({
      peso_neto: pesoNeto
    });


  }
}
onSubmit(){

}
guardar(){
 /* this.formulario_interno.formulario.patchValue({
      estado: 'GENERADO'
    });*/
  if(this.formulario_interno.formulario.valid){
    let formularioEnvio=this.formulario_interno.formulario.value;
    formularioEnvio={
      ...formularioEnvio,
      minerales:this.minerales_envio,
      municipio_origen:this.municipio_origen_envio
    }

    this.formularioInternoService.editarFormularioInterno(formularioEnvio,this.id).subscribe(
      (data:any) =>
      {
          this.formulario_Interno_registrado=this.formularioInternoService.handleCrearFormularioInterno(data);

        if(this.formulario_Interno_registrado!==null)
        {

          this.formulario_interno.formulario.reset();
          this.notify.success('El el formulario interno se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
          this.router.navigate(['/public/formulario-101/formulario-interno']);
        }
      },
      (error:any) =>
      {

        this.error=this.formularioInternoService.handleCrearFormularioInternoError(error.error.data);
        if(error.error.status=='fail')
        {
          this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
        }
  } );
  }
  else{
      this.mostrarErrorFormularios(this.formulario_interno);
      this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

 }

}
guardarMinerales(formulario_int_id:any) {
  this.lista_leyes_mineral.forEach((item) => {

      item.formulario_int_id=formulario_int_id;
    this.listaLeyesMineralesService.crearFormularioInternoMineral(item).subscribe((data:any) =>
    {

       this.listaLeyesMineralesService.handleCrearFormularioInternoMineral(data);


      if(data.error==null)
      {
        this.notify.success('Minerales Agregados Correctamente','Creado Correctamente',{timeOut:500,positionClass: 'toast-top-right'});
      }
    },
    (error:any) =>
    {

      this.error=this.listaLeyesMineralesService.handleCrearFormularioInternoMineralError(error.error.data);
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
    this.listaMunicipiosOrigenService.crearFormularioInternoMunicipioOrigen(item).subscribe((data:any) =>
    {
       this.listaMunicipiosOrigenService.handleCrearFormularioInternoMunicipioOrigen(data);


      if(data.error==null)
      {
        this.notify.success('Municios Origen Agregados Correctamente','Creado Correctamente',{timeOut:500,positionClass: 'toast-top-right'});
      }
    },
    (error:any) =>
    {

      this.error=this.listaMunicipiosOrigenService.handleCrearFormularioInternoMunicipioOrigenError(error.error.data);
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
          let envio_minerales:IFormularioInternoMineralEnvio={
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
  eliminar(domicilio:IFormularioInternoMineral) {
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
              let envio_origen:IFormularioInternoMunicipioOrigenEnvio={
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

  eliminarMunicipio(domicilio:IFormularioInternoMunicipioOrigen) {
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
      this.declaracionJurada=checkbox.checked;
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
private mostrarErrorFormularios(formGroup: FormularioInternoFormulario): void {
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

    this.formulario_interno.formulario.patchValue({
        placa: this.vehiculo.placa,
        tipo_transporte:this.vehiculo.tipo,
        });
}
cambioChofer(event:any){
    this.chofer=event;
    this.nro_licencia=this.chofer.nro_licencia;
    this.formulario_interno.formulario.patchValue({
        nom_conductor: event.nombre_apellidos,
        licencia: event.nro_licencia,
        });
}
cambioOperadorSimple(event:any){
    this.comprador=event;
        this.razon_social=this.comprador.razon_social;

        this.formulario_interno.formulario.patchValue({
            des_comprador: this.comprador.razon_social,
          });

}
valSwitches(event:any){

    this.valSwitch=event.checked;
}
}
