import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IUsuario } from '@data/usuario.metadata';
import { UsuariosService } from 'src/app/admin/services/usuarios.service';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';
import { RolesService } from 'src/app/admin/services/roles.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    templateUrl: './listar-usuario.component.html',
    styleUrls: ['./listar-usuario.component.scss'],
    providers: [MessageService]
})
export class ListarUsuarioComponent implements OnInit {

    public listaUsuarios!:IUsuario[];
    public isEditMode: boolean = false;
    public usuario:IUsuario={
        id: null,
        email: null,
        email_verified_at:null,
        nombre:null,
        apellidos:null,
        ci:null,
        celular:null,
        rol_id:null,
        operador_id:null,
        estado:null,
        created_at:null,
        updated_at:null,
        pass_gen:null,
        password:null,
        repetir_password:null
    };
    public roles!:IRol[];
    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;


    constructor(
        private messageService: MessageService,
        private usuariosService:UsuariosService,
        private rolesServices:RolesService,
        private operadoresService:OperatorsService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private confirmationService:ConfirmationService,
        private notify:ToastrService

    ) { }

    ngOnInit() {
        this.usuariosService.verusuarios(this.nombre).subscribe(
            (data:any)=>{
            this.listaUsuarios=this.usuariosService.handleusuario(data);

          },
          (error:any)=> this.error=this.usuariosService.handleError(error));

        this.rolesServices.verRoles().subscribe(
            (data:any)=>{
            this.roles=this.rolesServices.handlerol(data);

          },
          (error:any)=> this.error=this.rolesServices.handleError(error));
        this.operadoresService.verOperatorsSimple(this.nombre).subscribe(
            (data:any)=>{
            this.operadores=this.operadoresService.handleOperatorSimple(data);
        },
        (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));
        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }
    cerrar(event:any){
        this.productDialog=event;
        this.usuariosService.verusuarios(this.nombre).subscribe(
            (data:any)=>{
            this.listaUsuarios=this.usuariosService.handleusuario(data);

          },
          (error:any)=> this.error=this.usuariosService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.isEditMode = false;
        this.productDialog = true;
    }
    edit(usuario:IUsuario) {
            this.usuario = { ...usuario };

            //this.submitted = false;
            this.productDialog = true;
            this.isEditMode = true;
        }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }



    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        //this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        //this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;

    }
    diasActivos(fecha1:string):number{
        let dias:any;
        let fechas1 = new Date(fecha1);
        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        dias=fechas1.getTime()-hoy.getTime();
        dias=dias / 1000 / 60 / 60 / 24;
        dias=Math.round (dias);
        return dias;
    }
    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.listaUsuarios.length; i++) {
            if (this.listaUsuarios[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    userRol(rol_id:any):string{
        if(this.roles!=null){
        let resp='';
        let index = -1;
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].id === rol_id) {
                index = i;
                break;
            }
        }
        return this.roles[index].nombre;
    }
    return '';
    }
    userOperador(operador_id:any):string{
        if(operador_id!=null && this.operadores!=null){
        let index = -1;
        for (let i = 0; i < this.operadores.length; i++) {
            if (this.operadores[i].id === operador_id) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            return this.operadores[index].razon_social;
        }
        return '';
        }
        else{ return '';}


    }
    bloquearDialogo(usuario:IUsuario){

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
                delete usuario.password;

                this.usuariosService.editarusuario(usuario).subscribe(
                    (data:any) =>
                    {
                      this.usuariosService.handleCrearusuario(data);

                      if(data.error==null)
                      {
                        this.usuariosService.verusuarios('nada').subscribe(
                            (data:any)=>{
                            this.listaUsuarios=this.usuariosService.handleusuario(data);

                          },
                          (error:any)=> this.error=this.usuariosService.handleError(error));

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
    }
    resetPassword(usuario:IUsuario){

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Resetear Password?',
            accept: () => {
                usuario.password='12345678';
                const credenciales = {
                    id: usuario.id,
                    password: usuario.password
                };
                console.log(credenciales);
                this.usuariosService.editarusuario(credenciales).subscribe(
                    (data:any) =>
                    {
                      this.usuariosService.handleCrearusuario(data);

                      if(data.error==null)
                      {
                        this.usuariosService.verusuarios('nada').subscribe(
                            (data:any)=>{
                            this.listaUsuarios=this.usuariosService.handleusuario(data);

                          },
                          (error:any)=> this.error=this.usuariosService.handleError(error));

                        this.notify.success('Se reseteo la COntraseña','Operación realizada Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
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
    }
}
