import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { IFormularioTrasladoColaMineral } from '@data/form_cola_mineral.metadata';
import { IFormularioTrasladoColaMineralEnvio } from '@data/form_cola_mineral_envio.metadata';
import { IFormularioTrasladoColaMunicipioOrigen } from '@data/form_cola_municipio_origen.metadata';
import { IFormularioTrasladoColaMunicipioOrigenEnvio } from '@data/form_cola_municipio_origen_envio.metadata';
import { IFormularioTrasladoCola } from '@data/formulario_cola.metadata';

import { IMineral } from '@data/mineral.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { FormularioTrasladoColaMineralService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola-mineral.service';
import { FormularioTrasladoColaMunicipioOrigenService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola-municipioorigen.service';
import { FormularioTrasladoColaService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola.service';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { FormularioTrasladoColaFormulario } from 'src/app/admin/validators/formulario-cola';

@Component({
  selector: 'app-create-formulario-traslado-cola',
  templateUrl: './create-formulario-traslado-cola.component.html',
  styleUrls: ['./create-formulario-traslado-cola.component.scss']
})
export class CreateFormularioTrasladoColaComponent implements OnInit {

    public formulario_interno=new FormularioTrasladoColaFormulario();
    public departamento_id:number=0;
    public municipio_id:number=0;
    public declaracionJurada:boolean=false;
    departamento_id1: number | null = null;  // Guardar el ID del departamento seleccionado
  municipio_id1: number | null = null;
  // Método que se llama cuando cambia el departamento
  cambioDepartamento1(departamentoId: number): void {
    this.departamento_id1 = departamentoId;
    // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
  }
    public formulario_Interno_registrado:IFormularioTrasladoCola=null;
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
    public error!:any;
    public nombre:string='';
    public lista_leyes_mineral:IFormularioTrasladoColaMineral[]=[];
    public formulario_mineral:IFormularioTrasladoColaMineral={
        id:null,
        formulario_cola_id:null,
        sigla_mineral:'',
        descripcion:''
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
    { label: '1. Datos del mineral y/o Metal', command: (event: any) => this.gotoStep(0)},
    { label: '2. Origen del mineral y/o Metal',command: (event: any) => this.gotoStep(1) },
    { label: '3. Destino del mineral y/o Metal', command: (event: any) => this.gotoStep(2) },
    { label: '4. Datos del Medio de Transporte', command: (event: any) => this.gotoStep(3) }
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
        this.formulario_interno.formulario.get('lote')?.valid  &&
        this.formulario_interno.formulario.get('peso_neto')?.valid && this.lista_leyes_mineral.length>0;

        break;
      case 1:
        valid =this.lista_municipios_origen.length>0
        break;
      case 2:
        valid = this.formulario_interno.formulario.get('destino')?.valid &&
       (this.formulario_interno.formulario.get('almacen')?.valid ||
        this.formulario_interno.formulario.get('almacen')?.disabled) &&
       (this.formulario_interno.formulario.get('dique_cola')?.valid ||
        this.formulario_interno.formulario.get('dique_cola')?.disabled);
        break;
      // Agregar validaciones para otros pasos si es necesario
    }

    return valid;
  }



  constructor(
    private operadoresService:OperatorsService,
    private formularioTrasladoColaService:FormularioTrasladoColaService,
    private mineralesService:MineralsService,
    private notify:ToastrService,
    private authService:AuthService,
    private listaLeyesMineralesService:FormularioTrasladoColaMineralService,
    private listaMunicipiosOrigenService:FormularioTrasladoColaMunicipioOrigenService,
    private router: Router,
    private presentacionService:PresentacionService
  ) {

    this.formulario_interno.formulario.patchValue({
        user_id: authService.getUser.id,
        operador_id:authService.getUser.operador_id
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
        console.log(this.presentaciones);
      },
      (error:any)=> this.error=this.presentacionService.handleError(error));

    this.destinos = [
        { nombre: 'ALMACEN', id: '1' },
        { nombre: 'DIQUE DE COLAS', id: '2' },
    ];
    this.unidades = [
        { nombre: '%', id: '1' },
        { nombre: 'DM', id: '2' },
        { nombre: 'g/TM', id: '3' },
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
  }
  cambioDestino(event){
    if(event.value=='ALMACEN')
    {
      this.formulario_interno.formulario.patchValue({
        dique_cola: null
      });
    }
    else{
      {
        this.formulario_interno.formulario.patchValue({
          almacen: null
        });
      }
    }
    console.log(event);
  }
 // Función para calcular el peso neto
 calcularPesoNeto() {
        // Obtener los valores de cada campo individualmente
    const peso_bruto_humedo = this.formulario_interno.formulario.get('peso_bruto_humedo')?.value;
    const tara = this.formulario_interno.formulario.get('tara')?.value;



    // Validar que los campos necesarios tengan valores
    if (peso_bruto_humedo && tara !== null) {
      const pesoSinTara = peso_bruto_humedo - tara;

      // Calcular el peso neto
      let pesoNeto = pesoSinTara;
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
        municipio_origen:this.municipio_origen_envio,
        municipio_destino:this.municipio_destino_envio
      }
      console.log(formularioEnvio);
      this.formularioTrasladoColaService.crearFormularioTrasladoCola(formularioEnvio).subscribe(
        (data:any) =>
        {
            this.formulario_Interno_registrado=this.formularioTrasladoColaService.handleCrearFormularioTrasladoCola(data);

          if(this.formulario_Interno_registrado!==null)
          {
            console.log(this.formulario_Interno_registrado);
            this.formulario_interno.formulario.reset();
            this.notify.success('El el formulario interno se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
            this.router.navigate(['/public/formulario-101/formulario-traslado-cola/']);
          }
          else{
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        },
        (error:any) =>
        {

          this.error=this.formularioTrasladoColaService.handleCrearFormularioTrasladoColaError(error.error.data);
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

  agregarLey(){
    // Verifica si el formulario tiene datos completos
    if (this.formulario_mineral.descripcion && this.formulario_mineral.sigla_mineral) {
        // Verifica si el registro ya existe en la lista
        const existe = this.lista_leyes_mineral.some(ley => ley.sigla_mineral === this.formulario_mineral.sigla_mineral);

        if (existe) {
            this.notify.error('Ya existe el registro verifique los datos e intente nuevamente....','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
        }
        else{
            // Si no existe, agrega el registro
            this.notify.success('Agregado Exitosamente','Exito',{timeOut:2000,positionClass: 'toast-bottom-right'});
            let envio_minerales:IFormularioTrasladoColaMineralEnvio={
                mineralId:this.formulario_mineral.mineral_id
            }
            this.minerales_envio.push({...envio_minerales});
            this.lista_leyes_mineral.push({...this.formulario_mineral});

        }
    } else {
        this.notify.error('Por favor, complete todos los campos','Error con el Registro',{timeOut:2000,positionClass: 'toast-bottom-right'});
    }
  }

    eliminar(domicilio:IFormularioTrasladoColaMineral) {
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
                let envio_origen:IFormularioTrasladoColaMunicipioOrigenEnvio={
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
                let envio_origen:IFormularioTrasladoColaMunicipioOrigenEnvio={
                  id:this.municipio_destino.municipio_id
                }
                this.municipio_destino_envio.push({...envio_origen});
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

    cambioMunicipio1(event){
        this.municipio_id1=event;
        this.municipio_destino.municipio_id=event
    }
    declaracionJuradaSwitch(event:any){
        const checkbox = event.target as HTMLInputElement;
        this.declaracionJurada=checkbox.checked;
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
}
