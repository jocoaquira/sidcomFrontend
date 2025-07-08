import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { TextoAleatorio } from '../../functions/texto-aleatorio';
import { AuthService } from '@core/authentication/services/auth.service';
import { ProcedimientoFormulario } from '../../validators/procedimiento';
import { IProcedimiento } from '@data/procedimiento_tm.metadata';
import { IProcedimientoDetalle } from '@data/procedimiento_detalle.metadata';
import { ProcedimientoService } from '../../services/procedimiento/procedimiento.service';
import { ProcedimientoDetalleService } from '../../services/procedimiento/procedimiento_detalle.service';

@Component({
  selector: 'app-crear-procedimiento',
  templateUrl: './crear-procedimiento.component.html',
  styleUrls: ['./crear-procedimiento.component.scss']
})
export class CrearProcedimientoComponent implements OnInit {

  @Input() usuario!:IProcedimiento;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public errorVerificarContraseña:boolean=true;
  public errorVerificarEmail:boolean=false;
  public roles!:IRol[];
  public operadores!:IOperatorSimple[];
  public detalle_procedure:IProcedimientoDetalle={
    nombre: '',
    descripcion: '',
    procedimiento_id: null
  };
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public estados:any;
  public admin:boolean=false;
  public form=new ProcedimientoFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;
  public detalle_procedimiento:IProcedimientoDetalle[]=[];


  constructor(
    private rolesServices:RolesService,
    private operadoresService:OperatorsService,
    private procedimientoService:ProcedimientoService,
    private detalleProcedimientoService:ProcedimientoDetalleService,
    private notify:ToastrService,
    private authService:AuthService,
        ) {



        }

  ngOnInit(): void {


    this.operadoresService.verOperatorsSimple('hj').subscribe(
      (data:any)=>{
      this.operadores=this.operadoresService.handleOperatorSimple(data);
    },
    (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));

    this.estados = [
      { label: 'ACTIVO', value: '1' },
      { label: 'INACTIVO', value: '0' }
  ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.usuario && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.usuario.id,
        nombre: this.usuario.nombre,
        procedimiento: this.usuario.procedimiento,
        estado: this.estados.find((e: any) => e.label === this.usuario.estado) || null,
      });
    }

  }
  onChangeRol(rol_id:any){
    let id=rol_id.value;
    let rol:IRol=this.roles.find(element => element.id === id);
    if(rol.nombre.search('Operador')!=-1)
    {
      this.admin=false;
    }
    else{
      this.admin=true;
    }
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
      this.actualizarProcedimiento();
    } else {
      this.crearProcedimiento();
    }
  }
  actualizarProcedimiento() {

    this.form.formulario.value.estado=this.form.formulario.value.estado.label;
    this.form.formulario.value.celular=parseInt(this.form.formulario.value.celular);

    if (this.form.formulario.valid) {

        this.procedimientoService.editarProcedimiento(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.procedimientoService.handleCrearProcedimiento(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {

              this.errorUsuario=this.procedimientoService.handleCrearProcedimiento(error.error.data);
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
  crearProcedimiento() {

    this.form.formulario.patchValue({
      estado: 'ACTIVO',
    });
    if (this.form.formulario.valid && this.detalle_procedimiento.length>0) {
        this.procedimientoService.crearProcedimiento(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              let procedimiento=this.procedimientoService.handleCrearProcedimiento(data);

              if(data.error==null)
              {
                this.guardarDetalles(this.generarPasosDetalleTDM(this.detalle_procedimiento, procedimiento.id));
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {

              this.errorUsuario=this.procedimientoService.handleCrearProcedimientoError(error.error.data);
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
  agregarProcedimiento() {
      // Verificamos si 'detalle_procedure' no está vacío antes de agregarlo
    if (this.detalle_procedure) {

      this.detalle_procedimiento.push(this.detalle_procedure);
      this.detalle_procedure={
        nombre: '',
        descripcion: '',
        procedimiento_id: null
      }; // Vaciamos la detalle_procedure después de agregarla
    }
  }
  cambioProcedimiento(event:any){
    this.detalle_procedure.nombre =(event.target as HTMLInputElement).value;
  }
  eliminar(domicilio:any) {

        this.detalle_procedimiento=this.detalle_procedimiento.filter(val => val.nombre !== domicilio.nombre);
      }

generarPasosDetalleTDM(listaDetalle: IProcedimientoDetalle[], procedimiento_id: number): IProcedimientoDetalle[] {
    return listaDetalle.map((detalle, index) => {
        return {
            ...detalle,
            procedimiento_id: procedimiento_id, // Asigna el procedimiento_id
            descripcion: `Paso ${index + 1}`    // Genera la descripción dinámica
        };
    });
}
guardarDetalles(lista_detalles:IProcedimientoDetalle[]): void {
    if (lista_detalles.length > 0) {

        lista_detalles.forEach(detalle => {
            this.detalleProcedimientoService.crearProcedimientoDetalle(detalle).subscribe(
                (data: any) => {

                    this.notify.success('Detalle guardado correctamente', 'Éxito', { timeOut: 2000, positionClass: 'toast-top-right' });
                },
                (error: any) => {
                    console.error('Error al guardar detalle:', error);
                    this.notify.error('Error al guardar detalle', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
                }
            );
        });
    } else {
        this.notify.warning('No hay detalles para guardar', 'Advertencia', { timeOut: 2000, positionClass: 'toast-top-right' });
    }
}
}
