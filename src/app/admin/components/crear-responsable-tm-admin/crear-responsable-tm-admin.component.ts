import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { ResponsableTMService } from '../../services/toma-de-muestra/responsable-tm.service';
import { ResponsableTMFormulario } from '../../validators/responsable-tm';
import { IResponsableTM } from '@data/responsable_tm.metadata';

@Component({
  selector: 'app-crear-responsable-tm-admin',
  templateUrl: './crear-responsable-tm-admin.component.html',
  styleUrls: ['./crear-responsable-tm-admin.component.scss']
})
export class CrearResponsableTMAdminComponent implements OnInit {

  @Input() usuario!:IResponsableTM;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public errorVerificarContraseña:boolean=true;
  public errorVerificarEmail:boolean=false;
  public roles!:IRol[];
  public operadores!:IOperatorSimple[];
  public nombre:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public estados:any;
  public admin:boolean=false;
  public form=new ResponsableTMFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;

  constructor(
    private rolesServices:RolesService,
    private operadoresService:OperatorsService,
    private responsableTMAdminService:ResponsableTMService,
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
        ci: this.usuario.ci,
        apellidos: this.usuario.apellidos,
        email: this.usuario.email,
        celular: this.usuario.celular,
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

    this.form.formulario.value.estado=this.form.formulario.value.estado.label;
    this.form.formulario.value.celular=parseInt(this.form.formulario.value.celular);

    if (this.form.formulario.valid) {

        this.responsableTMAdminService.editarResponsableTM(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.responsableTMAdminService.handleCrearusuario(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {

              this.errorUsuario=this.responsableTMAdminService.handleCrearusuarioError(error.error.data);
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
      celular:parseInt(this.form.formulario.value.celular),
      estado:this.form.formulario.value.estado.label
    });
    if (this.form.formulario.valid) {
        let limpio:any= Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );
        this.responsableTMAdminService.crearResponsableTM(limpio).subscribe(
            (data:any) =>
            {
              this.responsableTMAdminService.handleCrearusuario(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {

              this.errorUsuario=this.responsableTMAdminService.handleCrearusuarioError(error.error.data);
              if(error.error.status=='fail')
              {
                this.notify.error(error.error.data,'Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
              }
            }
          );
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
  }
  errorEmailRepetido(event:any){
    const email = (event.target as HTMLInputElement).value;
    this.responsableTMAdminService.verificarEmail(email).subscribe(
      (data:any)=>{

        if(data==true)
        {
          this.errorVerificarEmail=true;
        }
        else{
          this.errorVerificarEmail=false;
        }
    },
    (error:any)=> this.error=this.responsableTMAdminService.handleError);
  }
  verificar(event:Event){
    const input = (event.target as HTMLInputElement).value;
    if(this.form.formulario.value.repetir_password==this.form.formulario.value.password){
      this.errorVerificarContraseña=false;
    }
    else{
      this.errorVerificarContraseña=true;
    }
  }

}
