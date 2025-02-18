import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { IPermiso } from '@data/permisos.metadata';
import { PermissionService } from '../../services/permission.service';
import { PermisoFormulario } from '../../validators/permiso';

@Component({
  selector: 'app-crear-permiso',
  templateUrl: './crear-permiso.component.html',
  styleUrls: ['./crear-permiso.component.scss']
})
export class CrearPermisoComponent implements OnInit {

  @Input() permiso!:IPermiso;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public nombre:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public form=new PermisoFormulario();
  public errorUsuario:any={};

  constructor(
    private rolesServices:RolesService,
    private operadoresService:OperatorsService,
    private PermisoService:PermissionService,
    private notify:ToastrService,
    private authService:AuthService,
        ) { 
          
            
            console.log(this.permiso);
        }

  ngOnInit(): void {
    

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.permiso && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.permiso.id,
        name: this.permiso.name
    });
    console.log(this.form.formulario.value);
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
      this.actualizarPermiso();
    } else {
      this.crearPermiso();
    }
  }
  actualizarPermiso() {
    

    if (this.form.formulario.valid) {
        console.log(this.form.formulario.value);
        this.PermisoService.editarPermission(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.PermisoService.handleCrearPermission(data);
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
              this.errorUsuario=this.PermisoService.handleCrearPermissionError(error.error.data);
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
  crearPermiso() {
    
    console.log(this.form.formulario.value);
    if (this.form.formulario.valid) {
        this.PermisoService.crearPermission(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.PermisoService.handleCrearPermission(data);
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
              this.errorUsuario=this.PermisoService.handleCrearPermissionError(error.error.data);
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
