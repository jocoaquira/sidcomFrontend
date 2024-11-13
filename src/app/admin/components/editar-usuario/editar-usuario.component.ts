import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUsuario } from '@data/usuario.metadata';
import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioFormulario } from '../../validators/usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  @Input() usuario!:IUsuario;
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
  public form=new UsuarioFormulario();
  public errorUsuario:any={};

  constructor(
    private rolesServices:RolesService,
    private operadoresService:OperatorsService,
    private usuarioService:UsuariosService,
    private notify:ToastrService
  ) {

  }

  ngOnInit(): void {
    this.rolesServices.verRoles('hj').subscribe(
      (data:any)=>{
      this.roles=this.rolesServices.handlerol(data.data);

    },
    (error:any)=> this.error=this.rolesServices.handleError(error));

    this.operadoresService.verOperatorsSimple('hj').subscribe(
      (data:any)=>{
      this.operadores=this.operadoresService.handleOperatorSimple(data.data);
    },
    (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));

    this.estados = [
      { label: 'HABILITADO', value: '1' },
      { label: 'DESHABILITADO', value: '0' }
  ];
  }
  onChangeRol(rol_id:any){
    let id=rol_id.value;
    let rol:IRol=this.roles.find(element => element.id === id);
    if(rol.name.search('Operador')!=-1)
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
  guardarusuario(){

  }
  onSubmit() {
    if(this.admin && this.form.formulario.value.password!=null){
      if (this.form.formulario.valid && !this.errorVerificarContraseña && !this.errorVerificarEmail) {
        this.usuarioService.crearusuario(this.form.formulario.value).subscribe(
          (data:any) =>
          {
            this.usuarioService.handleCrearusuario(data.data);
            if(data.status=='success')
            {
              this.form.formulario.reset();
              this.estadoDialogo.emit(false);
              this.notify.success('Creado Correctamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
            }
          },
          (error:any) =>
          {
            this.errorUsuario=this.usuarioService.handleCrearusuarioError(error.error.data);
            if(error.error.status=='fail')
            {
              this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
            }
          }
        );
        this.notify.success('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
    }
    else{
      if (this.form.formulario.valid && !this.errorVerificarEmail && this.form.formulario.value.operator_id!=null) {
        this.notify.success('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
    }
    
  }
  errorEmailRepetido(event:any){
    const email = (event.target as HTMLInputElement).value;
    this.usuarioService.verificarEmail(email).subscribe(
      (data:any)=>{
        
        if(data.data==true)
        {
          this.errorVerificarEmail=true;
        }
        else{
          this.errorVerificarEmail=false;
        }
    },
    (error:any)=> this.error=this.usuarioService.handleError(error));
  }
  errorPassword():boolean{
    return this.errorVerificarContraseña;
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
