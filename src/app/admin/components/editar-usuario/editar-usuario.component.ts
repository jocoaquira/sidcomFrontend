import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IUsuario } from '@data/usuario.metadata';
import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { UsuarioFormulario } from '../../validators/usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { TextoAleatorio } from '../../functions/texto-aleatorio';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  @Input() usuario!:IUsuario;
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
    this.rolesServices.verRoles().subscribe(
      (data:any)=>{

      this.roles=this.rolesServices.handlerol(data);

    },
    (error:any)=> this.error=this.rolesServices.handleError(error));

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
        apellidos: this.usuario.apellidos,
        ci: this.usuario.ci,
        email: this.usuario.email,
        celular: this.usuario.celular,
        rol_id: this.usuario.rol_id,
        operador_id: this.usuario.operador_id,
        estado: this.estados.find((e: any) => e.label === this.usuario.estado) || null,
      });
      let rolcito:any={value:this.usuario.rol_id};
      this.onChangeRol(rolcito);
      this.errorVerificarEmail=false;
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
      this.form.formulario.value.operador_id=null
    }
  }

  ocultarDialogo(){
    this.estadoDialogo.emit(false);
    this.form.formulario.reset();
  }
  crearUsuario(){
    this.form.formulario.patchValue({
      estado: this.form.formulario.value.estado.label || null,
    });
    this.form.formulario.value.celular=parseInt(this.form.formulario.value.celular);

    if(this.admin && this.form.formulario.value.password!=null){
      if (this.form.formulario.valid && !this.errorVerificarContraseña && !this.errorVerificarEmail) {

        this.usuarioService.crearusuario(this.form.formulario.value).subscribe(
          (data:any) =>
          {
            this.usuarioService.handleCrearusuario(data);

            if(data.error==null)
            {
              this.form.formulario.reset();
              this.estadoDialogo.emit(false);
              this.notify.success('El usuario se registro correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
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

      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
    }
    else{



      if (this.form.formulario.valid && !this.errorVerificarEmail && this.form.formulario.value.operador_id!=null) {
        let pass_gen=TextoAleatorio.generarCadenaSegura(8);
        this.form.formulario.value.password='12345678';
        this.form.formulario.value.pass_gen='12345678';
        this.usuarioService.crearusuario(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.usuarioService.handleCrearusuario(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
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
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
    }
  }
  onSubmit() {
    if (this.isEditMode) {
      this.actualizarUsuario();
    } else {
      this.crearUsuario();
    }
  }
  actualizarUsuario() {
    this.form.formulario.patchValue({
      estado: this.form.formulario.value.estado.label || null,
    });
    this.form.formulario.value.celular=parseInt(this.form.formulario.value.celular);


    Object.keys(this.form.formulario.controls).forEach(field => {
      const control = this.form.formulario.get(field);
      if (control?.errors) {

      }
    });
    if (this.form.formulario.valid) {

        this.usuarioService.editarusuario(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.usuarioService.handleEditarusuario(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
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
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
  }

  errorEmailRepetido(event:any){
    const email = (event.target as HTMLInputElement).value;

    this.usuarioService.verificarEmail(email).subscribe(
      (data:any)=>{

        if(data==true && this.isEditMode==false)
        {
          this.errorVerificarEmail=true;
        }
        else{
          if(this.isEditMode && data==true && this.usuario.email!=this.form.formulario.value.email)
          {
            this.errorVerificarEmail=true;
          }
          else{
            this.errorVerificarEmail=false;
          }

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
