import { Component, OnInit } from '@angular/core';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { IFormularioInternoMineral } from '@data/form_int_mineral.metadata';
import { IFormularioInternoMunicipioOrigen } from '@data/form_int_municipio_origen.metadata';
import { IMineral } from '@data/mineral.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { FormularioInternosService } from 'src/app/admin/services/formulariosinternos.service';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { FormularioInternoFormulario } from 'src/app/admin/validators/formulario-interno';

@Component({
  selector: 'app-create-formulario-interno',
  templateUrl: './create-formulario-interno.component.html',
  styleUrls: ['./create-formulario-interno.component.scss']
})
export class CreateFormularioInternoComponent implements OnInit {

    public formulario_interno=new FormularioInternoFormulario();
    public departamento_id:number=0;
    public departamento_id1:number=0;
    public formulario_Interno_registrado!:IFormularioInterno;
    public operadores!:IOperatorSimple[];
    public minerales!:IMineral[];
    public presentaciones!:any;
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
     public lista_municipios_origen:IFormularioInternoMunicipioOrigen[]=[];
     public municipio_origen:IFormularioInternoMunicipioOrigen={
        id:null,
        formulario_interno_id:null,
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

  activeStep: number = 0; // Establecer el paso activo inicial

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
    console.log(valid);
    switch (stepIndex) {
      case 0:
        // Validar los campos del Paso 1
        valid = this.formulario_interno.formulario.get('peso_bruto_humedo')?.valid && this.formulario_interno.formulario.get('tara')?.valid &&
        this.formulario_interno.formulario.get('merma')?.valid && this.formulario_interno.formulario.get('humedad')?.valid &&
        this.formulario_interno.formulario.get('lote')?.valid && this.formulario_interno.formulario.get('presentacion')?.valid &&
        this.formulario_interno.formulario.get('cantidad')?.valid && this.formulario_interno.formulario.get('peso_neto_seco')?.valid && this.lista_leyes_mineral.length>0;
        console.log(valid);
        break;
      case 1:
        // Validar los campos del Paso 2
        valid =true
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
  ) {

   }

  ngOnInit() {
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

      this.presentaciones = [
        { nombre: 'ENSACADO', id: '1' },
        { nombre: 'LINGOTES', id: '2' },
        { nombre: 'A GRANEL', id: '3' },
        { nombre: 'CATODO DE COBRE', id: '4' },
        { nombre: 'CONTENEDOR CILINDRICO', id: '5' },
        { nombre: 'EMBALADAS', id: '6' },
        { nombre: 'ENVASADO', id: '7' },
        { nombre: 'BROZA', id: '8' },
        { nombre: 'AMALGAMA', id: '9' },
        { nombre: 'GRANALLA', id: '10' },
        { nombre: 'ORO PEPA', id: '11' },
        { nombre: 'SACOS', id: '12' },
        { nombre: 'OTRO', id: '13' }
    ];
    this.destinos = [
        { nombre: 'COMPRADOR', id: '1' },
        { nombre: 'PLANTA DE TRATAMIENTO', id: '2' },
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
        peso_neto_seco: pesoNeto
      });
      console.log('Valores del formulario:', { peso_bruto_humedo, tara, merma, humedad });

    }
  }


  onSubmit(){

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
        console.log(event);
        this.municipio_origen.departamento=event;
    }
    cambioMunicipio(event){
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

    eliminarMunicipio(domicilio:IFormularioInternoMunicipioOrigen) {
        this.lista_municipios_origen = this.lista_municipios_origen.filter(val => val.municipio_id !== domicilio.municipio_id);
    }

    cambioDepartamento1(event){
        this.departamento_id1=event;
    }
    cambioMunicipio1(event){
        this.formulario_interno.formulario.value.municipio_id=event;
        console.log(this.formulario_interno.formulario.value);
    }
    declaracionJurada(event){

    }

    pesoNetoSeco(event){
        let peso_neto:number=0;
        this.formulario_interno.formulario.value.peso_bruto_humedo=event;
        let merma:number= this.formulario_interno.formulario.value.peso_bruto_humedo*this.formulario_interno.formulario.value.merma*(1/100);
        let humedad:number= this.formulario_interno.formulario.value.peso_bruto_humedo*this.formulario_interno.formulario.value.humedad*(1/100);
        this.formulario_interno.formulario.value.peso_neto_seco=this.formulario_interno.formulario.value.peso_bruto_humedo-this.formulario_interno.formulario.value.tara-merma-humedad;
    }
}
