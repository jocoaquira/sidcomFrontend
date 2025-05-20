import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';


import { ToastrService } from 'ngx-toastr';
import { IUsuarioCompleto } from '@data/usuario_completo.metadata';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-password-usuario',
  templateUrl: './cambiar-password-usuario.component.html',
  styleUrls: ['./cambiar-password-usuario.component.scss']
})
export class CambiarPasswordComponent implements OnInit {

  @Input() usuario: IUsuarioCompleto = {
    id: 0,
    nombre: '',
    apellidos: '',
    ci: '',
    email: '',
    celular: null,
    rol_id:null,
    nombre_rol: '',
    operador_id: null,
    razon_social: '',
    estado:'',
    password:''
  };

  @Input() isEditMode: boolean = false;
  @Input() isAdmin:boolean=false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public errorPass!:any;
  public nombre:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public estados:any;
  public admin:boolean=false;
  public errorUsuario:any={};
  valSwitch: boolean = false;
  public errorVerificarContraseña:boolean=false;
  public repetir_password:string='';


  constructor(
    private notify:ToastrService,
    private usuarioService:UsuariosService,
    private router:Router,
  ) {

  }

  ngOnInit(): void {

  }


  ocultarDialogo(){
    this.estadoDialogo.emit(false);
    if(this.isAdmin)
    {
        this.router.navigate(['/admin/']);
    }
    else
    {
        this.router.navigate(['/public/']);
    }
  }

  onSubmit() {
    if (this.isEditMode) {
        this.actualizarUsuario();

    }
  }
  valSwitches(event:any){
      console.log(event);
      this.valSwitch=event.checked;
      this.usuario.password='';
  }
  errorPassword():boolean{
    return this.errorVerificarContraseña;
  }
  verificar(event:Event){
    console.log()
    const input = (event.target as HTMLInputElement).value;
    if(this.repetir_password==this.usuario.password){
      this.errorVerificarContraseña=false;
    }
    else{
      this.errorVerificarContraseña=true;
    }
  }
  validarPassword() {


  console.log(this.usuario.password);
    // Longitud mínima de 8 caracteres
    if (this.usuario.password.length < 8) {
      this.errorPass='La contraseña debe tener al menos 8 caracteres.';
      return
    }

    // Al menos una letra mayúscula
    if (!/[A-Z]/.test(this.usuario.password)) {
      this.errorPass='La contraseña debe contener al menos una letra mayúscula.';
      return
    }

    // Al menos un número
    if (!/[0-9]/.test(this.usuario.password)) {
      this.errorPass='La contraseña debe contener al menos un número.';
      return
    }

    // No debe contener el nombre de usuario
    if (this.usuario.nombre && this.usuario.password.toLowerCase().includes(this.usuario.nombre.toLowerCase())) {
      this.errorPass='La contraseña no puede contener el nombre de usuario.';
      return
    }
    this.errorPass=null;
    //return errores;
  }
  actualizarUsuario() {


    console.log(this.usuario);

    if (this.errorPass==null && this.errorVerificarContraseña==false) {

        let datos = {
          id: this.usuario.id,
          password: this.usuario.password
        };
        console.log(this.usuario);
        this.usuarioService.editarusuario(datos).subscribe(
            (data:any) =>
            {
              this.usuarioService.handleEditarusuario(data);
              console.log(data);
              if(data.error==null)
              {
                this.estadoDialogo.emit(false);
                this.notify.success('Se cambio la contraseña exitosamente','Modificado Exitosamente',{timeOut:2500,positionClass: 'toast-top-right'});
                this.ocultarDialogo();
            }
            },
            (error:any) =>
            {
              console.log(error);
              this.errorUsuario=this.usuarioService.handleCrearusuarioError(error.error.data);
              if(error.error.status=='fail')
              {
                this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con la actualizacion',{timeOut:2000,positionClass: 'toast-top-right'});
              }
            }
          );
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con la actualizacion',{timeOut:2000,positionClass: 'toast-top-right'});
      }

  }



}
