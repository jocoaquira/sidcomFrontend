import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';


import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { IAprobarTM } from '@data/aprobar_tm.metadata';
import { TomaDeMuestraService } from '../../services/toma-de-muestra/toma-de-muestra.service';
import { AprobarTMFormulario } from '../../validators/aprobar-toma-de-muestra';
import { IProcedimiento } from '@data/procedimiento_tm.metadata';
import { ProcedimientoService } from '../../services/toma-de-muestra/procedimiento-tm.service';
import { ResponsableSenarecomService } from '../../services/responsable-senarecom.service';
import { IResponsableSenarecom } from '@data/responsable_senarecom_tm.metadata';
import { ITomaDeMuestraSimple } from '@data/toma_de_muestra_simple.metadata';
import { ITomaDeMuestra } from '@data/toma_de_muestra.metadata';

@Component({
  selector: 'app-aprobar-procedimiento',
  templateUrl: './aprobar-procedimiento.html',
  styleUrls: ['./aprobar-procedimiento.scss']
})
export class AprobarProcedimientoComponent implements OnInit {

  @Input() tmd!:ITomaDeMuestraSimple;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public errorVerificarContraseña:boolean=true;
  public errorVerificarEmail:boolean=false;
  public roles!:IRol[];
  public nombre:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public estados:any;
  public admin:boolean=false;
  public form=new AprobarTMFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;
  public procedimientos: IProcedimiento[] = []; // Para almacenar los procedimientos
  public tomaDM:ITomaDeMuestra;
  public agranel:boolean=false;
    public ensacado:boolean=false;
    public lingotes:boolean=false;
    public sal:boolean=false;
    public otro:boolean=false;
    public procedimientosSeleccionados: any[] = []; // Procedimientos seleccionados
    public listaResponsableSenarecom:IResponsableSenarecom[]=[];
    public selectedFile: File | null = null;
  constructor(
    private operadoresService:OperatorsService,
    private tomaDeMuestraService:TomaDeMuestraService,
    private notify:ToastrService,
    private authService:AuthService,
    private procedimientoService:ProcedimientoService,
    private responsableSenarecomService:ResponsableSenarecomService,
    private tomaDeMuestra:TomaDeMuestraService,
        ) { 
        }

  ngOnInit(): void {
    
    this.procedimientoService.verProcedimientos().subscribe(
      (data:any)=>{
      this.procedimientos=this.procedimientoService.handleProcedimientos(data);
      this.procedimientos = this.procedimientos.map((procedimiento: any) => ({
        ...procedimiento,
        selected: false  // Inicializamos con `false` (no seleccionado)
      }));
    },
    (error:any)=> this.error=this.procedimientoService.handleCrearProcedimientoError(error));
    this.responsableSenarecomService.verResponsableSenarecom('r').subscribe(
      (data:any)=>{
      this.listaResponsableSenarecom=this.responsableSenarecomService.handleusuario(data);
      // Añadimos el campo `fullName` concatenando nombre y apellido
      this.listaResponsableSenarecom = this.listaResponsableSenarecom.map(responsable => ({
        ...responsable,
        fullName: `${responsable.nombre} ${responsable.apellidos}` // Concatenamos nombre y apellido
      }));
      this.listaResponsableSenarecom = this.listaResponsableSenarecom.filter(responsable => responsable.estado === 'ACTIVO');
  
    },
    (error:any)=> this.error=this.responsableSenarecomService.handleError(error));

    this.estados = [
      { label: 'ACTIVO', value: '1' },
      { label: 'INACTIVO', value: '0' }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.tmd);
    if (changes && this.tmd && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.tmd.id,
        estado: 'APROBADO',
        operador_id:2,
        procedimiento: [],
      });
      
      this.tomaDeMuestraService.verTomaDeMuestra(this.tmd.id+'').subscribe(
        (data:any)=>{
        this.tomaDM=this.tomaDeMuestraService.handleCrearTomaDeMuestra(data);
        console.log(this.tomaDM);
        
      },
      (error:any)=> this.error=this.tomaDeMuestraService.handleAprobarTomaDeMuestraError(error));
    }
    console.log(this.form.formulario.value);
  }
  // Método para manejar los cambios en los checkboxes
  onCheckboxChange(event: any, procedimiento: any): void {
    if (event.target.checked) {
      // Si el checkbox está marcado, lo agregamos a los seleccionados
      this.procedimientosSeleccionados.push({ id: procedimiento.id });
    } else {
      // Si no está marcado, lo eliminamos de los seleccionados
      this.procedimientosSeleccionados = this.procedimientosSeleccionados.filter(
        (p) => p.id !== procedimiento.id
      );
    }
  }
// Método para mostrar los procedimientos seleccionados
  obtenerProcedimientosSeleccionados(): any[] {
    return this.procedimientosSeleccionados;
  }

  onChangeEstado(operator_id:any){

   // this.form.formulario.value.estado=operator_id.value
  }
  onChangeOperadores(operator_id:any){
  }
  ocultarDialogo(){
    this.form.formulario.reset();
    this.estadoDialogo.emit(false);
  }
  onSubmit(){
    if (this.isEditMode) {
      this.aprobarResponsable();
    } else {
      //this.crearResponsable();
    }
  }
  aprobarResponsableOriginal() {
    this.form.formulario.patchValue({
      procedimiento: this.procedimientosSeleccionados,
    });
    console.log(this.form.formulario.value);
    console.log(this.procedimientosSeleccionados)
    if (this.form.formulario.valid) {
        this.tomaDeMuestraService.aprobarTomaDeMuestra(this.form.formulario.value,this.form.formulario.value.id).subscribe(
            (data:any) =>
            {
              this.tomaDeMuestraService.handleAprobarTomaDeMuestra(data);
              console.log(data);
              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              console.log(error);
              this.errorUsuario=this.tomaDeMuestraService.handleAprobarTomaDeMuestraError(error.error.data);
              if(error.error.status=='fail')
              {
                this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
              }
            }
          );
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
  }

  aprobarResponsable() {
    // Verifica si hay un archivo seleccionado
    console.log(this.form.formulario.value);
    if (this.selectedFile) {
      // Crear un nuevo FormData para agregar tanto los datos del formulario como el archivo
      let formData = new FormData();

      // Agregar los datos del formulario al FormData
      this.form.formulario.patchValue({
        procedimiento: this.procedimientosSeleccionados,
      });

      formData.append('foto_link', this.selectedFile); // Agrega el archivo
      formData.append("estado", "APROBADO");
      formData.append("responsable_tdm_senarecom_id",this.form.formulario.value.responsable_tdm_senarecom_id);
     // formData.append("foto_link", file);
      formData.append("observaciones", this.form.formulario.value.observaciones);
      formData.append("operador_id", '1');
      formData.append("responsable_tdm_id", '4');
    
      // Extraer el ID del array "procedimiento"
      if (this.form.formulario.value.procedimiento && this.form.formulario.value.procedimiento.length > 0) {
        formData.append("procedimiento[]", this.form.formulario.value.procedimiento[0].id.toString());
      }



      // Verificar si todos los valores se agregaron correctamente
formData.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

      // Verifica si el formulario es válido antes de enviar
      if (this.form.formulario.valid) {
        this.tomaDeMuestraService.aprobarTomaDeMuestra(formData,this.form.formulario.value.id).subscribe(
          (data: any) => {
            this.tomaDeMuestraService.handleAprobarTomaDeMuestra(data);
            console.log(data);
            if (data.error == null) {
              this.form.formulario.reset();
              this.estadoDialogo.emit(false);
              this.notify.success('Creado Correctamente', 'Creado Correctamente', { timeOut: 2500, positionClass: 'toast-top-right' });
            }
          },
          (error: any) => {
            console.log(error);
            this.errorUsuario = this.tomaDeMuestraService.handleAprobarTomaDeMuestraError(error.error.data);
            if (error.error.status == 'fail') {
              this.notify.error('Falló...Revise los campos y vuelva a enviar....', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
            }
          }
        );
      } else {
        this.notify.error('Revise los datos e intente nuevamente', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
      }
    } else {
      this.notify.error('Debe seleccionar un archivo antes de enviar', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
  }
  // Método para capturar el archivo seleccionado
  onFileSelect(event: any) {
    const file: File = event.files[0]; // Aquí capturamos el primer archivo seleccionado
    this.selectedFile = file; // Lo guardamos en la propiedad selectedFile
    console.log('Archivo seleccionado:', file);
  }


  declaracionJuradaSwitch(event:any){
    const checkbox = event.target as HTMLInputElement;
    //this.lingotes=checkbox.checked;
}
}
