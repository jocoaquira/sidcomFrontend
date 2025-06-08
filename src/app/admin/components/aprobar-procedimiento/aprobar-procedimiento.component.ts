import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';


import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { IAprobarTM } from '@data/aprobar_tm.metadata';
import { TomaDeMuestraService } from '../../services/toma-de-muestra/toma-de-muestra.service';
import { AprobarTMFormulario } from '../../validators/aprobar-toma-de-muestra';
import { IProcedimiento } from '@data/procedimiento_tm.metadata';
import { ResponsableSenarecomService } from '../../services/responsable-senarecom.service';
import { IResponsableSenarecom } from '@data/responsable_senarecom_tm.metadata';
import { ITomaDeMuestraSimple } from '@data/toma_de_muestra_simple.metadata';
import { ITomaDeMuestraPDF } from '@data/toma_de_muestra_pdf.metadata';
import { FileUpload } from 'primeng/fileupload';
import { ProcedimientoService } from '../../services/procedimiento/procedimiento.service';

@Component({
  selector: 'app-aprobar-procedimiento',
  templateUrl: './aprobar-procedimiento.html',
  styleUrls: ['./aprobar-procedimiento.scss']
})
export class AprobarProcedimientoComponent implements OnInit {

  @Input() tmd!:ITomaDeMuestraSimple;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  @ViewChild('fileUploadComponent') fileUploadComponent!: FileUpload;
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
  public procedimientos: any[] = []; // Para almacenar los procedimientos
  public agranel:boolean=false;
    public ensacado:boolean=false;
    public lingotes:boolean=false;
    public sal:boolean=false;
    public otro:boolean=false;
    public procedimientosSeleccionados: any[] = []; // Procedimientos seleccionados
    public listaResponsableSenarecom:IResponsableSenarecom[]=[];
    public selectedFile: File | null = null;
    public tdm_completo:ITomaDeMuestraPDF;
  constructor(
    private tomaDeMuestraService:TomaDeMuestraService,
    private notify:ToastrService,
    private authService:AuthService,
    private procedimientoService:ProcedimientoService,
    private responsableSenarecomService:ResponsableSenarecomService,
        ) {
        }

  ngOnInit(): void {

    this.procedimientoService.verProcedimientos().subscribe(
      (data:any)=>{
      this.procedimientos=this.procedimientoService.handleprocedimiento(data);
      this.procedimientos = this.procedimientos.map((procedimiento: any) => ({
        ...procedimiento,
        selected: false,  // Inicializamos con `false` (no seleccionado)
        muestras: procedimiento.muestras.map((muestra: any) => ({
            ...muestra,
            selected: false // Inicializamos cada muestra con `false`
        }))
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
    console.log('IMPRESEE',this.tmd);
    if (changes && this.tmd.id!=null && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.tmd.id,
        estado: 'EMITIDO',
        operador_id:this.tmd.operador_id,
        responsable_tdm_id:this.tmd.responsable_tdm_id,
        procedimiento: [],
      });

      this.tomaDeMuestraService.verTomaDeMuestraPDF(this.tmd.id+'').subscribe(
            (data:any)=>{
            this.tdm_completo=this.tomaDeMuestraService.handleTomaDeMuestraPDF(data);
            console.log('pdf:',this.tdm_completo);
          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
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
    console.log("Formulario:", this.form.formulario.value); // Depuración inicial

    // Verificar si hay un archivo seleccionado
    if (!this.selectedFile) {
      this.notify.error('Debe seleccionar un archivo antes de enviar', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
      return;
    }

    let formData = new FormData();

    // Agregar el archivo al FormData
    formData.append('foto_link', this.selectedFile);
    formData.append("estado", "EMITIDO");

    // Validar `responsable_tdm_senarecom_id`
    if (this.form.formulario.value.responsable_tdm_senarecom_id) {
      formData.append("responsable_tdm_senarecom_id", this.form.formulario.value.responsable_tdm_senarecom_id.toString());
    } else {
      this.notify.error('Falló... Revise el campo responsable_tdm_senarecom_id y vuelva a enviar.', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
      return;
    }

    // Validar `observaciones`
    if (this.form.formulario.value.observaciones) {
      formData.append("observaciones", this.form.formulario.value.observaciones);
    } else {
      formData.append("observaciones", '');
    }

    // Validar `operador_id`
    if (this.tmd.operador_id !== undefined && this.tmd.operador_id !== null) {
      formData.append("operador_id", this.tmd.operador_id.toString());
    } else {
      this.notify.error('Falló... Revise el campo operador_id y vuelva a enviar.', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
      return;
    }

    // Validar `responsable_tdm_id`
    if (this.tmd.responsable_tdm_id !== undefined && this.tmd.responsable_tdm_id !== null) {
      formData.append("responsable_tdm_id", this.tmd.responsable_tdm_id.toString());
    } else {
      this.notify.error('Falló... Revise el campo responsable_tdm_id y vuelva a enviar.', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
      return;
    }
    // Agregar procedimientos seleccionados
    if (this.procedimientosSeleccionados && Array.isArray(this.procedimientosSeleccionados) && this.procedimientosSeleccionados.length>0) {
      this.procedimientosSeleccionados.forEach((item: any) => {
        if (item.id !== undefined && item.id !== null) {
          formData.append("procedimiento[]", item.id.toString());
          console.log(item.id.toString());
        } else {
          console.error("Error: Un procedimiento tiene un ID indefinido", item);
        }
      });
    } else {
      this.notify.error('Falló... Revise el campo  procedimiento es undefined o no es un array y vuelva a enviar.', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
      return;
    }

    // Verificar si todos los valores se agregaron correctamente
    console.log("Valores en FormData:");
    formData.forEach((value, key) => console.log(`${key}: ${value}`));
    console.log('formulario valid: '+this.form.formulario.valid);
    // Verificar si el formulario es válido antes de enviar


    // Enviar los datos al servicio
    this.tomaDeMuestraService.aprobarTomaDeMuestra(formData, this.form.formulario.value.id).subscribe(
      (data: any) => {
        this.tomaDeMuestraService.handleAprobarTomaDeMuestra(data);
        console.log("Respuesta del servidor:", data);

        if (data.error == null) {
          this.form.formulario.reset();
          this.selectedFile=null;
          this.fileUploadComponent.clear(); // Limpiar el componente de carga de archivos
          this.procedimientos.forEach(p => p.selected = false);
          this.procedimientosSeleccionados = [];
          this.estadoDialogo.emit(false);
          this.notify.success('Creado Correctamente', 'Creado Correctamente', { timeOut: 2500, positionClass: 'toast-top-right' });
        }
      },
      (error: any) => {
        console.error("Error en la petición:", error);
        this.errorUsuario = this.tomaDeMuestraService.handleAprobarTomaDeMuestraError(error.error.data);

        if (error.error.status == 'fail') {
          this.notify.error('Falló... Revise los campos y vuelva a enviar.', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
        }
      }
    );
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
