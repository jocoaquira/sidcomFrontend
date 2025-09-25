import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { IDepartamento } from '@data/departamento.metadata';
import { IFormularioInternoMineral } from '@data/form_int_mineral.metadata';
import { IFormularioInternoMineralEnvio } from '@data/form_int_mineral_envio.metadata';
import { IFormularioInternoMunicipioOrigen } from '@data/form_int_municipio_origen.metadata';
import { IFormularioInternoMunicipioOrigenEnvio } from '@data/form_int_municipio_origen_envio.metadata';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { IMineral } from '@data/mineral.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, retry } from 'rxjs';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { FormularioCooperativaFormulario } from 'src/app/admin/validators/formulario-cooperativa';
import { FormularioCooperativaService } from 'src/app/admin/services/formulario-interno-cooperativa/formulario-cooperativa.service';
import { IChofer } from '@data/chofer.metadata';
import { IVehiculo } from '@data/vehiculo.metadata';
import { TipoTransporteService } from 'src/app/admin/services/tipo-transporte.service';
import { IOperator } from '@data/operator.metadata';
import { PlantaDeTratamientoService } from 'src/app/admin/services/planta-tratamientos.service';

@Component({
  selector: 'app-edit-formulario-interno-cooperativa',
  templateUrl: './edit-formulario-interno-cooperativa.component.html',
  styleUrls: ['./edit-formulario-interno-cooperativa.component.scss']
})
export class EditFormularioInternoCooperativaComponent implements OnInit {
  public id:number=null;
  public num_form!:any;
  public formulario_interno=new FormularioCooperativaFormulario(this.tipoTransporteService);
  public departamento_id:number=0;
  public municipio_id:number=0;
  public operador_id:number=0;
  public placa:string='';
  public razon_social:string='';
  public nro_licencia:string='';
  public chofer:IChofer | null = null; // ID del chofer seleccionado
  public vehiculo:IVehiculo | null = null; // ID del vehiculo seleccionado
  //public comprador:IOperatorSimple | null = null; // ID del vehiculo seleccionado
  public declaracionJurada:boolean=false;
  departamento_id1: number | null = null;  // Guardar el ID del departamento seleccionado
  municipio_id1: number | null = null;
  departamento_id_pt:number|null=null;
  municipio_id_pt:number|null=null
// Método que se llama cuando cambia el departamento
cambioDepartamento1(departamentoId: number): void {
  this.departamento_id1 = departamentoId;
  // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
}
  public formulario_Interno_registrado:IFormularioInterno=null;
  public operadores!:IOperatorSimple[];
  public operador!:IOperator;
  public minerales!:IMineral[];
  public municipios!:IMunicipio[];
  public departamentos!:IDepartamento[];
  public presentaciones!:any;
  public presentacion:any={
      nombre:null,
      id:null,
      humedad:0,
      merma:0,
      cantidad:0
  }
  public valSwitch:boolean=false;
  public valSwitchPT:boolean=false;
  public tipo_transporte!:any;
  public destinos!:any;
  public unidades!:any;
  public tipo_traslado!:any;
  public ley!:any;
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
   public compradores:any[]=[];
   public lista_municipios_origen:IFormularioInternoMunicipioOrigen[]=[];
   public municipio_origen:IFormularioInternoMunicipioOrigen={
      id:null,
      formulario_int_id:null,
      departamento:null,
      municipio:null,
      municipio_id:null
   }
   public comprador:any={
      municipioId:null,
      comprador:null,
      cantidad:null
   }
  public cantidadSacos:number=0;
    // Definir los pasos para Steps
steps = [
  { label: '1. Datos del Medio de Transporte y mineral y/o Metal', command: (event: any) => this.gotoStep(0)},
  { label: '3. Destino del mineral y/o Metal',command: (event: any) => this.gotoStep(1) }
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
        valid = this.formulario_interno.formulario.get('peso_bruto_humedo')?.valid && this.formulario_interno.formulario.get('tara')?.valid &&
        (this.formulario_interno.formulario.get('merma')?.valid || this.formulario_interno.formulario.get('merma')?.disable) &&
        (this.formulario_interno.formulario.get('humedad')?.valid || this.formulario_interno.formulario.get('humedad')?.disable) &&
        (this.formulario_interno.formulario.get('lote')?.valid || this.operador.generacion_nro_lote) &&
        this.formulario_interno.formulario.get('presentacion_id')?.valid &&
        (this.formulario_interno.formulario.get('cantidad')?.valid || this.formulario_interno.formulario.get('cantidad')?.disabled) &&
        this.lista_leyes_mineral.length>0;

        break;
      case 1:
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
  private formularioCooperativaService:FormularioCooperativaService,
  private mineralesService:MineralsService,
  private notify:ToastrService,
  private authService:AuthService,
  private departamentosService: DepartamentosService,
  private municipiosService:  MunicipiosService,
 // private listaLeyesMineralesService:FormularioInternoMineralService,
 // private listaMunicipiosOrigenService:FormularioInternoMunicipioOrigenService,
  private router: Router,
  private presentacionService:PresentacionService,
  private actRoute:ActivatedRoute,
  private tipoTransporteService: TipoTransporteService,
  private plantaTratamientoService:PlantaDeTratamientoService
) {
  this.actRoute.paramMap.subscribe(params=>{
     this.id=parseInt(params.get('id'));
     this.operador_id=this.authService.getUser.operador_id;
    this.formularioCooperativaService.verFormularioInterno(this.id.toString()).subscribe(
      (data:any)=>{
      let formulario_int=data;
      this.num_form=formulario_int.nro_formulario;

      this.cargar_datos(formulario_int);
      this.placa=this.formulario_interno.formulario.value.placa;
      this.nro_licencia=this.formulario_interno.formulario.value.licencia;
     // this.formulario_interno.formulario.get('operador_id')?.disable(); // Para desactivar

    },
    (error:any)=> this.error=this.formularioCooperativaService.handleError(error));
  });
  this.formulario_interno.formulario.patchValue({
      user_id: authService.getUser.id,
      operador_id:authService.getUser.operador_id
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
      peso_bruto_humedo: form.peso_bruto_humedo,
      peso_neto: form.peso_neto,
      tara: form.tara,
      humedad: form.humedad,
      merma: form.merma,
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
  console.log('Formulario Interno cargado:', this.formulario_interno.formulario.value);
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

  // Asegurar que también obtenemos los compradores del formulario existente
  if (form.compradores) {
      this.compradores = [...form.compradores];
  }

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

      // Cargar plantas de tratamiento para verificar si la planta existente está en la lista
      this.plantaTratamientoService.verPlantaDeTratamientos('gh')
        .pipe(
          retry(3),
          catchError((error) => {
            console.error('Error al cargar plantas de tratamiento:', error);
            return of([]);
          })
        )
        .subscribe(
          (data: any) => {
            const plantasTratamiento = this.plantaTratamientoService.handlePlantaDeTratamiento(data);

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

                  let  origen_min:IFormularioInternoMineral={
                    sigla_mineral:this.minerales[index].sigla,
                    descripcion:this.minerales[index].nombre,
                    ley:item.ley,
                    unidad:item.unidad,
                    mineral_id:this.minerales[index].id
                  }
                  this.lista_leyes_mineral.push({...origen_min});
                });

                // Manejar la precarga de destino basado en el tipo
                if (this.formulario_interno.formulario.value.des_tipo === 'PLANTA DE TRATAMIENTO') {
                  // Verificar si la planta de tratamiento existe en la lista de opciones
                  const plantaExiste = plantasTratamiento.some(
                    planta => planta.nombre === this.formulario_interno.formulario.value.des_planta
                      && planta.municipioId === this.formulario_interno.formulario.value.id_municipio_destino
                  );
                  console.log('Planta existe:', plantaExiste);
                  if (!plantaExiste) {
                    // Si la planta no existe en la lista, activar el switch y cargar manualmente
                    this.valSwitchPT = true;
                  } else {
                    // Si la planta existe en la lista pero aún no se ha seleccionado correctamente,
                    // intentamos asegurar que el selector tenga los datos adecuados
                    this.valSwitchPT = false; // Aseguramos que el switch esté desactivado para usar el selector
                  }
                } else if (this.formulario_interno.formulario.value.des_tipo === 'COMPRADOR') {
                  // Para comprador, cargar los valores si existen
                  if (this.formulario_interno.formulario.value.id_municipio_destino) {
                    this.municipio_id1 = this.formulario_interno.formulario.value.id_municipio_destino;
                    const municipioDestino = this.municipios.find(dat => dat.id === this.municipio_id1);
                    if (municipioDestino) {
                      this.departamento_id1 = municipioDestino.departamento_id;
                    }
                  }
                }

                // Si hay compradores, recalcular la suma total
                if (this.compradores && this.compradores.length > 0) {
                  console.log('Compradores cargados:', this.compradores);
                }
              }
            );
          }
        );
    });
  });

  Object.values(this.formulario_interno.formulario.controls).forEach(control => {
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
  });
}

cargar_datos_inicial(operador: any) {
  // Mapear los municipios de origen desde arrendamientos
  this.municipio_origen_envio = operador.arrendamientos.map(destino => ({
    id: destino.municipio_id
  }));

  // Cargar municipios
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

      // Cargar departamentos
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

          // Procesar municipios de origen
          this.municipio_origen_envio.forEach((item) => {
            const municipio = this.municipios.find(m => m.id === item.id);
            if (municipio) {
              const departamento = this.departamentos.find(d => d.id === municipio.departamento_id);

              if (departamento) {
                const origen_mun: IFormularioInternoMunicipioOrigen = {
                  municipio: municipio.municipio,
                  departamento: departamento.nombre,
                  municipio_id: municipio.id
                };
                this.lista_municipios_origen.push({ ...origen_mun });
              }
            }
          });

          // Actualizar municipio y departamento de destino
          this.municipio_id1 = this.formulario_interno.formulario.value.id_municipio_destino;
          const municipioDestino = this.municipios.find(dat => dat.id === this.municipio_id1);
          if (municipioDestino) {
            this.departamento_id1 = municipioDestino.departamento_id;
          }
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

  this.operadoresService.verOperator(this.operador_id.toString()).subscribe(
      (data:any)=>{
          this.operador=this.operadoresService.handleCrearoperator(data);
          this.cargar_datos_inicial(this.operador);
          console.log(this.operador);
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
  this.tipo_traslado = [
    { nombre: 'BROZA', id: '1' },
    { nombre: 'CONCENTRADO', id: '2' },
  ];
  this.ley = [
    { nombre: 'Baja', id: '1' },
    { nombre: 'Media', id: '2' },
    { nombre: 'Alta', id: '3' },
  ];
  this.tipo_transporte = [
      { nombre: 'TRAILER', id: '1' },
      { nombre: 'CAMION', id: '2' },
      { nombre: 'VOLQUETA', id: '3' },
      { nombre: 'CAMION CON ACOPLE', id: '4' },
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
}

// Función para calcular el peso neto
calcularPesoNeto() {
      // Obtener los valores de cada campo individualmente
  const peso_bruto_humedo = this.formulario_interno.formulario.get('peso_bruto_humedo')?.value;
  const tara = this.formulario_interno.formulario.get('tara')?.value;
  const merma = this.formulario_interno.formulario.get('merma')?.value;
  const humedad = this.formulario_interno.formulario.get('humedad')?.value;

  // Validar que los campos necesarios tengan valores
  if (peso_bruto_humedo !== null && peso_bruto_humedo !== undefined &&
      tara !== null && tara !== undefined) {
    // Calcular el peso neto después de la tara
    const pesoSinTara = peso_bruto_humedo - tara;

    // Calcular merma y humedad basadas en el peso bruto húmedo
    const valorMerma = (merma !== null && merma !== undefined) ? (peso_bruto_humedo * (merma / 100)) : 0;
    const valorHumedad = (humedad !== null && humedad !== undefined) ? (peso_bruto_humedo * (humedad / 100)) : 0;

    // Calcular el peso neto final
    let pesoNeto = pesoSinTara - valorMerma - valorHumedad;

    // Asegurarse de que el peso neto no sea negativo
    if (pesoNeto < 0) {
      pesoNeto = 0;
    }

    this.formulario_interno.formulario.patchValue({
      peso_neto: pesoNeto
    });
  }
}
onSubmit(){
  this.guardar();
}


getAllFormErrors(form: FormGroup): any {
  let formErrors: any = {};

  Object.keys(form.controls).forEach(key => {
    const controlErrors = form.get(key)?.errors;
    if (controlErrors) {
      formErrors[key] = controlErrors;
    }

    // Si es un FormGroup anidado, buscar recursivamente
    if (form.get(key) instanceof FormGroup) {
      const nestedErrors = this.getAllFormErrors(form.get(key) as FormGroup);
      if (Object.keys(nestedErrors).length > 0) {
        formErrors[key] = { ...formErrors[key], ...nestedErrors };
      }
    }

    // Si es un FormArray
    if (form.get(key) instanceof FormArray) {
      const formArray = form.get(key) as FormArray;
      formArray.controls.forEach((control, index) => {
        if (control instanceof FormGroup) {
          const arrayErrors = this.getAllFormErrors(control);
          if (Object.keys(arrayErrors).length > 0) {
            if (!formErrors[key]) formErrors[key] = {};
            formErrors[key][index] = arrayErrors;
          }
        } else if (control.errors) {
          if (!formErrors[key]) formErrors[key] = {};
          formErrors[key][index] = control.errors;
        }
      });
    }
  });

  return formErrors;
}


  mostrarErrores() {
  const errores = this.getAllFormErrors(this.formulario_interno.formulario);
  console.log('Errores del formulario:', errores);

  // También puedes mostrar errores específicos
  Object.keys(errores).forEach(campo => {
    console.log(`Campo ${campo}:`, errores[campo]);
  });
}

marcarCamposComoTocados() {
  this.formulario_interno.formulario.markAllAsTouched();
}
guardar(){

  if(this.formulario_interno.formulario.valid){
    let formularioEnvio=this.formulario_interno.formulario.value;
    formularioEnvio={
      ...formularioEnvio,
      minerales:this.minerales_envio,
      municipio_origen:this.municipio_origen_envio,
    }
    if(this.formulario_interno.formulario.value.des_tipo==='COMPRADOR'){
        formularioEnvio={
            ...formularioEnvio,
            compradores:this.compradores
          }
    }
    this.formularioCooperativaService.editarFormularioInterno(formularioEnvio,this.id).subscribe(
      (data:any) =>
      {
          this.formulario_Interno_registrado=this.formularioCooperativaService.handleCrearFormularioInterno(data);

        if(this.formulario_Interno_registrado!==null)
        {

          this.formulario_interno.formulario.reset();
          this.notify.success('El el formulario interno de  cooperativa se editó exitosamente','Editado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
          this.router.navigate(['/public/formulario-101/formulario-cooperativa']);
        }
      },
      (error:any) =>
      {

        this.error=this.formularioCooperativaService.handleCrearFormularioInternoError(error.error.data);
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
    this.formulario_mineral.ley='0';
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

eliminarComprador(compradorIndex: number) {
    this.compradores.splice(compradorIndex, 1);
}

eliminarCompradorPorIndice(indice: number) {
    if (indice >= 0 && indice < this.compradores.length) {
        this.compradores.splice(indice, 1);
    }
}

agregarComprador(){
    try {
        // Verificar si el campo cantidad existe y está deshabilitado
        const controlCantidad = this.formulario_interno.formulario.get('cantidad');
        const cantidadDisabled = controlCantidad ? controlCantidad.disabled : false;
        console.log('Campo cantidad:', controlCantidad);
        console.log('Cantidad deshabilitada:', cantidadDisabled);

        // Controlar límite cuando cantidad está deshabilitada
        if (cantidadDisabled && this.compradores.length >= 1) {
            this.notify.error('Solo se permite agregar un comprador cuando cantidad está deshabilitada', 'Límite alcanzado', {
                timeOut: 2000,
                positionClass: 'toast-bottom-right'
            });
            return;
        }

        // Calcular la suma total de cantidades de compradores existentes
        const sumaCantidadesCompradores = this.compradores.reduce((total, comprador) => {
            return total + (comprador.cantidad || 0);
        }, 0);

        // Obtener el valor del campo cantidad del formulario
        const cantidadFormulario = this.formulario_interno.formulario.value.cantidad;

        // Nueva restricción: Verificar que la suma no exceda la cantidad disponible
        if (cantidadFormulario !== null && cantidadFormulario !== undefined) {
            const cantidadTotalConNuevo = sumaCantidadesCompradores + (this.cantidadSacos || 0);

            if (cantidadTotalConNuevo > cantidadFormulario) {
                this.notify.error(`La suma total de cantidades (${cantidadTotalConNuevo}) excede la cantidad disponible (${cantidadFormulario})`, 'Límite excedido', {
                    timeOut: 3000,
                    positionClass: 'toast-bottom-right'
                });
                return;
            }
        }

        // Configurar cantidad por defecto si está deshabilitada
        if (cantidadDisabled && this.compradores.length < 1) {
            this.cantidadSacos = 1;
        }

        // Validar según el modo (valSwitch)
        if (this.valSwitch) {
            this.agregarEnModoSwitch(sumaCantidadesCompradores);
        } else {
            this.agregarEnModoNormal(sumaCantidadesCompradores);
        }

    } catch (error) {
        console.error('Error en agregarComprador:', error);
        this.notify.error('Error al agregar comprador', 'Error', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
        });
    }
}

agregarEnModoSwitch(sumaCantidadesCompradores) {
    // Validaciones para modo switch activado
    if (!this.municipio_id1) {
        this.notify.error('Seleccione un municipio', 'Campo requerido', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
        });
        return;
    }

    if (!this.formulario_interno.formulario.value.des_comprador ||
        this.formulario_interno.formulario.value.des_comprador.trim() === '') {
        this.notify.error('Ingrese el nombre del comprador', 'Campo requerido', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
        });
        return;
    }

    if (!this.cantidadSacos || this.cantidadSacos <= 0) {
        this.notify.error('La cantidad debe ser mayor a 0', 'Campo requerido', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
        });
        return;
    }

    // Verificar restricción de cantidad final
    const cantidadFormulario = this.formulario_interno.formulario.value.cantidad;
    const cantidadTotalFinal = sumaCantidadesCompradores + this.cantidadSacos;

    if (cantidadFormulario !== null && cantidadFormulario !== undefined &&
        cantidadTotalFinal > cantidadFormulario) {
        this.notify.error(`No puede agregar ${this.cantidadSacos} sacos. La cantidad total sería ${cantidadTotalFinal}, excediendo el límite de ${cantidadFormulario}`, 'Límite excedido', {
            timeOut: 3000,
            positionClass: 'toast-bottom-right'
        });
        return;
    }

    // Agregar comprador
    this.comprador.comprador = this.formulario_interno.formulario.value.des_comprador;
    this.comprador.municipioId = this.municipio_id1;
    this.comprador.cantidad = this.cantidadSacos;
    this.compradores.push({...this.comprador});

    // Limpiar formulario
    this.limpiarFormulario();

    this.notify.success('Comprador agregado exitosamente', 'Éxito', {
        timeOut: 2000,
        positionClass: 'toast-bottom-right'
    });
}

agregarEnModoNormal(sumaCantidadesCompradores) {
    // Validaciones para modo switch desactivado
    if (!this.comprador.comprador) {
        this.notify.error('El comprador es requerido', 'Campo requerido', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
        });
        return;
    }

    if (!this.cantidadSacos || this.cantidadSacos <= 0) {
        this.notify.error('La cantidad debe ser mayor a 0', 'Campo requerido', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
        });
        return;
    }

    // Verificar restricción de cantidad final
    const cantidadFormulario = this.formulario_interno.formulario.value.cantidad;
    const cantidadTotalFinal = sumaCantidadesCompradores + this.cantidadSacos;

    if (cantidadFormulario !== null && cantidadFormulario !== undefined &&
        cantidadTotalFinal > cantidadFormulario) {
        this.notify.error(`No puede agregar ${this.cantidadSacos} sacos. La cantidad total sería ${cantidadTotalFinal}, excediendo el límite de ${cantidadFormulario}`, 'Límite excedido', {
            timeOut: 3000,
            positionClass: 'toast-bottom-right'
        });
        return;
    }

    // Agregar comprador
    this.comprador.cantidad = this.cantidadSacos;
    this.compradores.push({...this.comprador});

    // Limpiar datos
    this.comprador = {
        comprador: null,
        municipioId: null,
        cantidad: null
    };
    this.cantidadSacos = null;

    console.log('Compradores actualizados:', this.compradores);
    this.notify.success('Comprador agregado exitosamente', 'Éxito', {
        timeOut: 2000,
        positionClass: 'toast-bottom-right'
    });
}

limpiarFormulario() {
    this.municipio_id1 = null;
    this.departamento_id1 = null;
    this.cantidadSacos = null;
    this.formulario_interno.formulario.patchValue({
        des_comprador: null,
    });
}

// Método adicional para obtener la suma actual (útil para mostrar en UI)
getSumaTotalCompradores() {
    return this.compradores.reduce((total, comprador) => total + (comprador.cantidad || 0), 0);
}

// Método para verificar si se puede agregar más
puedeAgregarMas() {
    const cantidadFormulario = this.formulario_interno.formulario.value.cantidad;
    const sumaActual = this.getSumaTotalCompradores();

    if (cantidadFormulario === null || cantidadFormulario === undefined) {
        return true; // No hay restricción si no hay cantidad definida
    }

    return sumaActual < cantidadFormulario;
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

  1(event){
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
private mostrarErrorFormularios(formGroup: FormularioCooperativaFormulario): void {
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
  this.router.navigate(['/public/formulario-101/formulario-cooperativa']);
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
valSwitchesPT(event:any){

    this.valSwitchPT=event.checked;
}

cambioMunicipioPT(event){
    this.municipio_id_pt=event;
    this.formulario_interno.formulario.value.id_municipio_destino=event;

    this.formulario_interno.formulario.patchValue({
        id_municipio_destino: event
      });
      console.log(this.formulario_interno.formulario.value)
  }

cambioPlantaDeTratamiento(event:any){
    //this.comprador=event;
        console.log(event);
        this.formulario_interno.formulario.patchValue({
            des_planta: event.nombre,
            id_municipio_destino:event.municipioId
          });
          console.log(this.formulario_interno.formulario.value);
}
cambioComprador(event:any){
    //this.comprador=event;
        console.log(event);
        this.comprador.comprador=event.razon_social;
        this.comprador.municipioId=event.municipioId;
        this.formulario_interno.formulario.patchValue({
            des_comprador: this.comprador.razon_social,
          });
          console.log(this.formulario_interno.formulario.value);
}
cambioDepartamentoPT(departamentoId: number): void {
    this.departamento_id_pt = departamentoId;
    // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
  }
}
