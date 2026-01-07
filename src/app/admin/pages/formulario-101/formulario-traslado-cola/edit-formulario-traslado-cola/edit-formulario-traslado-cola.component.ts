import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { IDepartamento } from '@data/departamento.metadata';
import { IFormularioInternoMineral } from '@data/form_int_mineral.metadata';
import { IFormularioInternoMineralEnvio } from '@data/form_int_mineral_envio.metadata';
import { IFormularioInternoMunicipioOrigen } from '@data/form_int_municipio_origen.metadata';
import { IFormularioInternoMunicipioOrigenEnvio } from '@data/form_int_municipio_origen_envio.metadata';
import { IMineral } from '@data/mineral.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { IChofer } from '@data/chofer.metadata';
import { IVehiculo } from '@data/vehiculo.metadata';
import { catchError, of, retry } from 'rxjs';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { FormularioInternoMineralService } from 'src/app/admin/services/formulario-interno/formulariointerno-mineral.service';
import { FormularioInternoMunicipioOrigenService } from 'src/app/admin/services/formulario-interno/formulariointerno-municipioorigen.service';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { FormularioTrasladoColaService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola.service';
import { FormularioTrasladoColaFormulario } from 'src/app/admin/validators/formulario-cola';
import { IFormularioTrasladoCola } from '@data/formulario_cola.metadata';
import { IFormularioTrasladoColaMunicipioOrigen } from '@data/form_cola_municipio_origen.metadata';
import { TipoTransporteService } from 'src/app/admin/services/tipo-transporte.service';

@Component({
  selector: 'app-edit-formulario-traslado-cola',
  templateUrl: './edit-formulario-traslado-cola.component.html',
  styleUrls: ['./edit-formulario-traslado-cola.component.scss']
})
export class EditFormularioTrasladoColaComponent implements OnInit {
  public id:number=0;
  public num_form!:any;
  public formulario_traslado_cola=new FormularioTrasladoColaFormulario(this.tipoTransporteService);
  public departamento_id:number=0;
  public municipio_id:number=0;
  public operador_id:number | null = null;
  public placa:string='';
  public nro_licencia:string='';
  public chofer:IChofer | null = null;
  public vehiculo:IVehiculo | null = null;
  public declaracionJurada:boolean=false;
  //public minerales:IMineral[]=[];

  departamento_id1: number | null = null;  // Guardar el ID del departamento seleccionado
municipio_id1: number | null = null;
// Método que se llama cuando cambia el departamento
cambioDepartamento1(departamentoId: number): void {
  this.departamento_id1 = departamentoId;
  // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
}
  public formulario_traslado_cola_registrado:IFormularioTrasladoCola=null;
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
   public municipio_destino_envio:any=[];
   public lista_municipios_origen:IFormularioTrasladoColaMunicipioOrigen[]=[];
   public lista_municipios_destino:IFormularioTrasladoColaMunicipioOrigen[]=[];
   public municipio_origen:IFormularioTrasladoColaMunicipioOrigen={
      id:null,
      formulario_cola_id:null,
      departamento:null,
      municipio:null,
      municipio_id:null
   }
   public municipio_destino:IFormularioTrasladoColaMunicipioOrigen={
    id:null,
    formulario_cola_id:null,
    departamento:null,
    municipio:null,
    municipio_id:null
 }

    // Definir los pasos para Steps
steps = [
  { label: '1. Datos del Medio de Transporte y mineral y/o Metal', command: (event: any) => this.gotoStep(0)},
  { label: '2. Origen del mineral y/o Metal',command: (event: any) => this.gotoStep(1) },
  { label: '3. Destino del mineral y/o Metal', command: (event: any) => this.gotoStep(2) },
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
      this.formulario_traslado_cola.formulario.markAllAsTouched();
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
  cambioOperador(event:any){
    this.operador_id = event?.value ?? null;
    this.placa = '';
    this.nro_licencia = '';
    this.chofer = null;
    this.vehiculo = null;
    this.formulario_traslado_cola.formulario.patchValue({
      placa: null,
      nom_conductor: null,
      licencia: null
    });
  }

// Validar si los campos del paso actual son correctos
isStepValid(stepIndex: number): boolean {
  let valid = true;
  switch (stepIndex) {
    case 0:
      // Validar los campos del Paso 1
      valid = this.formulario_traslado_cola.formulario.get('peso_bruto_humedo')?.valid && this.formulario_traslado_cola.formulario.get('tara')?.valid &&
      this.formulario_traslado_cola.formulario.get('lote')?.valid &&
      this.formulario_traslado_cola.formulario.get('peso_neto')?.valid && this.lista_leyes_mineral.length>0;

      break;
    case 1:
      valid =this.lista_municipios_origen.length>0
      break;
    case 2:
      valid = this.formulario_traslado_cola.formulario.get('destino')?.valid &&
     (this.formulario_traslado_cola.formulario.get('almacen')?.valid ||
      this.formulario_traslado_cola.formulario.get('almacen')?.disabled) &&
     (this.formulario_traslado_cola.formulario.get('dique_cola')?.valid ||
      this.formulario_traslado_cola.formulario.get('dique_cola')?.disabled);
      break;
    // Agregar validaciones para otros pasos si es necesario
  }

  return valid;
}



constructor(
  private operadoresService:OperatorsService,
  private formularioTraladoDeCola:FormularioTrasladoColaService,
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
  this.actRoute.paramMap.subscribe(params=>{
     this.id=parseInt(params.get('id'));
    this.formularioTraladoDeCola.verFormularioTrasladoCola(this.id.toString()).subscribe(
      (data:any)=>{
      let formulario_int=data;

      this.num_form=formulario_int.nro_formulario;

      this.cargar_datos(formulario_int);
      this.operador_id = formulario_int.operador_id ?? null;
      this.placa=this.formulario_traslado_cola.formulario.value.placa;
      this.nro_licencia=this.formulario_traslado_cola.formulario.value.licencia;
     // this.formulario_traslado_cola.formulario.get('operador_id')?.disable(); // Para desactivar

    },
    (error:any)=> this.error=this.formularioTraladoDeCola.handleError(error));
  });
  this.formulario_traslado_cola.formulario.patchValue({
      user_id: authService.getUser.id
    });
 }
cargar_datos(form:any){
  this.formulario_traslado_cola.formulario.patchValue({
      id: form.id,
      user_id: form.user_id,
      operador_id: form.operador_id,
      nro_formulario: form.nro_formulario,
      lote: form.lote,
      peso_bruto_humedo: form.peso_bruto_humedo,
      peso_neto: form.peso_neto,
      tara: form.tara,
      destino: form.destino,
      almacen: form.almacen,
      dique_cola: form.dique_cola,
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
      nro_viajes: form.nro_viajes,
      estado: form.estado
  });

  this.minerales_envio=form.minerales//.push({...envio_minerales});
  // Crear una nueva lista excluyendo ciertos campos
    this.minerales_envio = form.minerales.map(mineral => {
      // Devuelve solo los campos necesarios
      return {
        mineralId: mineral.mineralId
      };
    });

  //this.lista_leyes_mineral.push({...this.formulario_mineral});

  this.municipio_origen_envio=form.municipio_origen;
  this.municipio_destino_envio=form.municipio_destino;
  // Crear una nueva lista excluyendo ciertos campos
  this.municipio_origen_envio = form.municipio_origen.map(destino => {
    // Devuelve solo los campos necesarios
    return {
      id: destino.municipioId,
    };
  });
  this.municipio_destino_envio = form.municipio_destino.map(destino => {
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

            let  origen_mun:IFormularioTrasladoColaMunicipioOrigen={
              municipio:this.municipios[index].municipio,
              departamento:departamento.nombre,
              municipio_id:this.municipios[index].id,
            }
            this.lista_municipios_origen.push({...origen_mun});
          });

          this.municipio_destino_envio.forEach((item) => {
            let index = this.municipios.findIndex(i => i.id === item.id);
            let departamento=this.departamentos.find(dat=>dat.id===this.municipios[index].departamento_id);

            let  origen_mun:IFormularioTrasladoColaMunicipioOrigen={
              municipio:this.municipios[index].municipio,
              departamento:departamento.nombre,
              municipio_id:this.municipios[index].id,
            }
            this.lista_municipios_destino.push({...origen_mun});
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
          this.municipio_id1=this.formulario_traslado_cola.formulario.value.id_municipio_destino;
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
      { nombre: 'ALMACEN', id: '1' },
      { nombre: 'DIQUE DE COLAS', id: '2' },
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
  this.formulario_traslado_cola.formulario.get('cantidad')?.disable();
  this.formulario_traslado_cola.formulario.get('humedad')?.disable();
  this.formulario_traslado_cola.formulario.get('merma')?.disable();

  this.formulario_traslado_cola.formulario.get('peso_bruto_humedo')?.valueChanges.subscribe(() => {
      this.calcularPesoNeto();
    });
    this.formulario_traslado_cola.formulario.get('tara')?.valueChanges.subscribe(() => {
      this.calcularPesoNeto();
    });
    this.formulario_traslado_cola.formulario.get('merma')?.valueChanges.subscribe(() => {
      this.calcularPesoNeto();
    });
    this.formulario_traslado_cola.formulario.get('humedad')?.valueChanges.subscribe(() => {
      this.calcularPesoNeto();
    });
}

// Función para calcular el peso neto
calcularPesoNeto() {
      // Obtener los valores de cada campo individualmente
  const peso_bruto_humedo = this.formulario_traslado_cola.formulario.get('peso_bruto_humedo')?.value;
  const tara = this.formulario_traslado_cola.formulario.get('tara')?.value;
  const merma = this.formulario_traslado_cola.formulario.get('merma')?.value;
  const humedad = this.formulario_traslado_cola.formulario.get('humedad')?.value;


  // Validar que los campos necesarios tengan valores
  if (peso_bruto_humedo && tara !== null && merma !== null && humedad !== null) {
    const pesoSinTara = peso_bruto_humedo - tara;

    // Calcular el peso neto
    let pesoNeto = pesoSinTara;
    this.formulario_traslado_cola.formulario.patchValue({
      peso_neto: pesoNeto
    });


  }
}
onSubmit(){

}
guardar(){
 /* this.formulario_traslado_cola.formulario.patchValue({
      estado: 'GENERADO'
    });*/

  if(this.formulario_traslado_cola.formulario.valid){
    let formularioEnvio=this.formulario_traslado_cola.formulario.value;
    formularioEnvio={
      ...formularioEnvio,
      minerales:this.minerales_envio,
      municipio_origen:this.municipio_origen_envio,
      municipio_destino:this.municipio_destino_envio
    }


    this.formularioTraladoDeCola.editarFormularioTrasladoCola(formularioEnvio,this.id).subscribe(
      (data:any) =>
      {
          this.formulario_traslado_cola_registrado=this.formularioTraladoDeCola.handleCrearFormularioTrasladoCola(data);

        if(this.formulario_traslado_cola_registrado!==null)
        {

          this.formulario_traslado_cola.formulario.reset();
          this.notify.success('El el formulario interno se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
          this.router.navigate(['/admin/formulario-101/formulario-traslado-cola/']);
        }
      },
      (error:any) =>
      {

        this.error=this.formularioTraladoDeCola.handleCrearFormularioTrasladoColaError(error.error.data);
        if(error.error.status=='fail')
        {
          this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
        }
  } );
  }
  else{
      this.mostrarErrorFormularios(this.formulario_traslado_cola);
      this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

 }

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
  agregarMunicipioDestino(){
    if (this.municipio_destino.departamento && this.municipio_destino.municipio && this.municipio_destino.municipio_id) {
        // Verifica si el registro ya existe en la lista
        const existe = this.lista_municipios_destino.some(municipio => municipio.municipio_id === this.municipio_destino.municipio_id);

        if (existe) {
            this.notify.error('Ya existe el registro verifique los datos e intente nuevamente....','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
        }
        else{
            // Si no existe, agrega el registro
            this.notify.success('Agregado Exitosamente','Exito',{timeOut:2000,positionClass: 'toast-bottom-right'});
            let envio_destino:IFormularioInternoMunicipioOrigenEnvio={
              id:this.municipio_destino.municipio_id
            }
            this.municipio_destino_envio.push({...envio_destino});
            this.lista_municipios_destino.push({...this.municipio_destino});
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
  cambioNombreDepartemento1(event){

    this.municipio_destino.departamento=event;
}
  cambioMunicipio(event){
      this.municipio_id=event;
      this.municipio_origen.municipio_id=event;
  }

  cambioNombreMunicipio(event){
      this.municipio_origen.municipio=event;
  }
  cambioNombreMunicipio1(event){
    this.municipio_destino.municipio=event;
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

  eliminarMunicipio(domicilio:IFormularioTrasladoColaMunicipioOrigen) {
      this.municipio_origen_envio=this.municipio_origen_envio.filter(val => val.id !== domicilio.municipio_id)
      this.lista_municipios_origen = this.lista_municipios_origen.filter(val => val.municipio_id !== domicilio.municipio_id);

    }
    eliminarMunicipioDestino(domicilio:IFormularioTrasladoColaMunicipioOrigen) {
        this.municipio_destino_envio=this.municipio_destino_envio.filter(val => val.id !== domicilio.municipio_id)
        this.lista_municipios_destino = this.lista_municipios_destino.filter(val => val.municipio_id !== domicilio.municipio_id);

      }

  cambioMunicipio1(event){
      this.municipio_id1=event;
      this.municipio_destino.municipio_id=event;
  }
  declaracionJuradaSwitch(event:any){
      const checkbox = event.target as HTMLInputElement;
      this.declaracionJurada=checkbox.checked;
  }
  cambioDestino(event){
    if(event.value=='ALMACEN')
    {
      this.formulario_traslado_cola.formulario.patchValue({
        des_planta: null
      });
    }
    else{
      {
        this.formulario_traslado_cola.formulario.patchValue({
          des_comprador: null
        });
      }
    }

  }

  cambioPresentacion(event:any){
      this.presentacion=this.presentaciones.filter(val => val.id === event.value)[0];


      if (this.presentacion.cantidad==1) {
          this.formulario_traslado_cola.formulario.get('cantidad')?.enable();
      } else {
      this.formulario_traslado_cola.formulario.get('cantidad')?.disable();
      this.formulario_traslado_cola.formulario.get('cantidad')?.setValue(null);
      }
      if (this.presentacion.merma==1) {
      this.formulario_traslado_cola.formulario.get('merma')?.enable();
      } else {
      this.formulario_traslado_cola.formulario.get('merma')?.disable();
      this.formulario_traslado_cola.formulario.get('merma')?.setValue(0);
      }
      if (this.presentacion.humedad==1) {
      this.formulario_traslado_cola.formulario.get('humedad')?.enable();
      } else {
      this.formulario_traslado_cola.formulario.get('humedad')?.disable();
      this.formulario_traslado_cola.formulario.get('humedad')?.setValue(0);
      }
}
private mostrarErrorFormularios(formGroup: FormularioTrasladoColaFormulario): void {
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

    this.formulario_traslado_cola.formulario.patchValue({
        placa: this.vehiculo.placa,
        tipo_transporte:this.vehiculo.tipo,
        });
}
cambioChofer(event:any){
    this.chofer=event;
    this.nro_licencia=this.chofer.nro_licencia;
    this.formulario_traslado_cola.formulario.patchValue({
        nom_conductor: event.nombre_apellidos,
        licencia: event.nro_licencia,
        });
}
}
