import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { IRol } from '@data/rol.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { IChofer } from '@data/chofer.metadata';
import { ChoferFormulario } from '../../validators/chofer';
import { ChoferService } from 'src/app/admin/services/chofer.service';
import { IOperatorSimple } from '@data/operador_simple.metadata';

@Component({
  selector: 'app-crear-chofer-admin',
  templateUrl: './crear-chofer-admin.component.html',
  styleUrls: ['./crear-chofer-admin.component.scss']
})
export class CrearChoferAdminComponent implements OnInit {

  @Input() usuario!:IChofer;
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
  public form=new ChoferFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;
  public operadores!:IOperatorSimple[];

  constructor(
    private choferService:ChoferService,
    private operadoresService:OperatorsService,
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
        nombre_apellidos: this.usuario.nombre_apellidos,
        nro_licencia: this.usuario.nro_licencia,
        operador_id: this.operadores.find((op: any) => op.id === this.usuario.operador_id).id || null, // Buscar el operador en la lista
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
   // this.form.formulario.value.estado=this.form.formulario.value.estado.label;
  }
  ocultarDialogo(){

    this.form.formulario.reset();
    this.estadoDialogo.emit(false);
  }
  onSubmit(){
    if (this.isEditMode) {
      this.actualizarResponsable();
    } else {
      this.crearResponsable();
    }
  }
  actualizarResponsable() {

    if (!this.form.formulario.value.estado) {
        this.notify.error('Seleccione un estado valido', 'Error', { timeOut: 2000 });
        return;
    }

    // Usa optional chaining (?.) para evitar errores
    const estadoLabel = this.form.formulario.value.estado?.label;

    this.form.formulario.patchValue({
        estado: estadoLabel
    });
    if (this.form.formulario.valid) {
        let limpio:any= Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );


        this.choferService.editarChofer(limpio).subscribe(
            (data:any) =>
            {
              this.choferService.handleCrearchofer(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              this.errorUsuario=this.choferService.handleCrearchoferError(error.error.data);
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
  crearResponsable() {

    this.form.formulario.patchValue({
      estado:this.form.formulario.value.estado.label
    });

    if (this.form.formulario.valid) {
        let limpio:any= Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );
        this.choferService.crearChofer(limpio).subscribe(
            (data:any) =>
            {
              this.choferService.handleCrearchofer(data);
              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              this.errorUsuario=this.choferService.handleCrearchoferError(error.error.data);
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


}
