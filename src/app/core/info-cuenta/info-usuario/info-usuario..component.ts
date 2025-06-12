import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UsuariosService } from 'src/app/admin/services/usuarios.service';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';
import { RolesService } from 'src/app/admin/services/roles.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IUsuarioCompleto } from '@data/usuario_completo.metadata';



@Component({
    templateUrl: './info-usuario.component.html',
    styleUrls: ['./info-usuario.component.scss'],
    providers: [MessageService]
})
export class InfoUsuarioComponent implements OnInit {


    public usuario:IUsuarioCompleto=null;
    public isEditMode:boolean=true;
    public usuario_id:number=null;
    public error:any=null;
    public isAdmin:boolean=false;

    constructor(
        private usuarioService:UsuariosService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService
    ) {
        this.usuario_id= authService.getUser.id

        if(authService.getUser.operador_id==null)
        {
            this.isAdmin=true;
        }
    }

    ngOnInit() {
        this.usuarioService.verusuarioCompleto(this.usuario_id).subscribe(
            (data:any)=>{
            this.usuario=this.usuarioService.handleUsuarioCompleto(data);


          },
          (error:any)=> this.error=this.usuarioService.handleError(error));

    }
    cerrar(event:any){

    }
    openNew() {

    }

    hideDialog() {

    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


    bloquearDialogo(usuario:IUsuarioCompleto){
        /*
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Realizar esta Operación?',
            accept: () => {
                if(usuario.estado=='ACTIVO')
                    {
                        usuario.estado='INACTIVO';
                    }
                    else{
                        usuario.estado='ACTIVO';
                    }
                this.usuarioService.editarusuario(this.usuario).subscribe(
                    (data:any) =>
                    {
                      this.usuarioService.handleCrearthis.usuario(data);

                      if(data.error==null)
                      {
                        this.usuarioService.usuarios('nada').subscribe(
                            (data:any)=>{
                            this.listaMinerales=this.usuarioService.handlethis.usuario(data);


                          },
                          (error:any)=> this.error=this.usuarioService.handleError(error));

                        this.notify.success('Actualizado Correctamente','Actualizado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                      }
                    },
                    (error:any) =>
                    {
                      if(error.error.status=='fail')
                      {
                        this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con la Actualizacion',{timeOut:2000,positionClass: 'toast-top-right'});
                      }
                    }
                  );
              },
        });
        */
    }
}
