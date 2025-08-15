import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { IFormularioInternoMineral } from '@data/form_int_mineral.metadata';
import { IFormularioInternoMunicipioOrigen } from '@data/form_int_municipio_origen.metadata';
import { IMineral } from '@data/mineral.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { FormularioInternoMineralService } from 'src/app/admin/services/formulario-interno/formulariointerno-mineral.service';
import { FormularioInternoMunicipioOrigenService } from 'src/app/admin/services/formulario-interno/formulariointerno-municipioorigen.service';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { FormularioInternoFormulario } from 'src/app/admin/validators/formulario-interno';
import { IFormularioInternoMineralEnvio } from '@data/form_int_mineral_envio.metadata';
import { IFormularioInternoMunicipioOrigenEnvio } from '@data/form_int_municipio_origen_envio.metadata';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { IChofer } from '@data/chofer.metadata';
import { IVehiculo } from '@data/vehiculo.metadata';
import { TipoTransporteService } from 'src/app/admin/services/tipo-transporte.service';

@Component({
  selector: 'app-create-formulario-interno',
  templateUrl: './create-formulario-interno.component.html',
  styleUrls: ['./create-formulario-interno.component.scss']
})
export class CreateFormularioInternoComponent implements OnInit {

    public formulario_interno: FormularioInternoFormulario;
    public departamento_id:number=0;
    public municipio_id:number=0;
    public operador_id:number=0;
    public placa:string='';
    public nro_licencia:string='';
    public razon_social:string='';
    public chofer:IChofer | null = null; // ID del chofer seleccionado
    public vehiculo:IVehiculo | null = null; // ID del vehiculo seleccionado
    public comprador:IOperatorSimple | null = null; // ID del vehiculo seleccionado
    public declaracionJurada:boolean=false;
    departamento_id1: number | null = null;  // Guardar el ID del departamento seleccionado
  municipio_id1: number | null = null;
  // Método que se llama cuando cambia el departamento
  cambioDepartamento1(departamentoId: number): void {
    this.departamento_id1 = departamentoId;
    // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
  }
    public formulario_Interno_registrado:IFormularioInterno;
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
    public valSwitch:boolean=false;
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
    private formularioInternoService:FormularioInternosService,
    private mineralesService:MineralsService,
    private notify:ToastrService,
    private authService:AuthService,
    private listaLeyesMineralesService:FormularioInternoMineralService,
    private listaMunicipiosOrigenService:FormularioInternoMunicipioOrigenService,
    private router: Router,
    private presentacionService:PresentacionService,
    private tipoTransporteService: TipoTransporteService
  ) {
    this.operador_id=this.authService.getUser.operador_id;
    this.formulario_interno = new FormularioInternoFormulario(this.tipoTransporteService);
    this.formulario_interno.formulario.patchValue({
        user_id: authService.getUser.id,
        operador_id:this.operador_id
      });

   }

  ngOnInit() {
    this.departamento_id=0;

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
    this.formulario_interno.formulario.patchValue({
        estado: 'GENERADO'
      });
    if(this.formulario_interno.formulario.valid){
      let formularioEnvio=this.formulario_interno.formulario.value;
      formularioEnvio={
        ...formularioEnvio,
        minerales:this.minerales_envio,
        municipio_origen:this.municipio_origen_envio
      }
      this.formularioInternoService.crearFormularioInterno(formularioEnvio).subscribe(
        (data:any) =>
        {
            this.formulario_Interno_registrado=this.formularioInternoService.handleCrearFormularioInterno(data);

          if(this.formulario_Interno_registrado!==null)
          {
            this.formulario_interno.formulario.reset();
            this.notify.success('El el formulario interno se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
            this.router.navigate(['/public/formulario-101/formulario-interno']);
          }
          else{
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        },
        (error:any) =>
        {

          this.error=this.formularioInternoService.handleCrearFormularioInternoError(error.error.data);
          if(error.error.status=='fail')
          {
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        }

          );
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
    // Verifica si el formulario tiene datos completos
    let sw:boolean=false;
    if((this.formulario_mineral.unidad=='%' && parseFloat(this.formulario_mineral.ley)<100  && parseFloat(this.formulario_mineral.ley)>0) || (this.formulario_mineral.unidad=='g/TM'&& parseFloat(this.formulario_mineral.ley)>0))
    {
         sw=true;
    }
    else{
        this.notify.error('Revise el campo Ley (no mayor a 100  si unidad es % y si es g/TM mayor a cero )...','Error con el Registro',{timeOut:5000,positionClass: 'toast-bottom-right'});
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
        //
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
    cambioChofer(event:any){
        this.chofer=event;
        this.nro_licencia=this.chofer.nro_licencia;
        this.formulario_interno.formulario.patchValue({
            nom_conductor: event.nombre_apellidos,
            licencia: event.nro_licencia,
          });
    }
    cambioVehiculo(event:any){
        this.vehiculo=event;
        this.placa=this.vehiculo.placa;

        this.formulario_interno.formulario.patchValue({
            placa: this.vehiculo.placa,
            tipo_transporte:this.vehiculo.tipo,
          });
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
