import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UsuariosService } from 'src/app/admin/services/usuarios.service';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';
import { RolesService } from 'src/app/admin/services/roles.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IPermiso } from '@data/permisos.metadata';
import { PermissionService } from 'src/app/admin/services/permission.service';



@Component({
    templateUrl: './listar-permisos.component.html',
    styleUrls: ['./listar-permisos.component.scss'],
    providers: [MessageService]
})
export class ListarPermisoComponent implements OnInit {

    public listaPermisos!:IPermiso[];
    
    public roles!:IRol[];
    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public permiso:IPermiso={
        id: null,
        name:null
    };
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private permisoService:PermissionService,
        private rolesServices:RolesService,
        private operadoresService:OperatorsService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService
    ) { 
        this.operador_id= authService.getUser.operador_id
        
    }

    ngOnInit() {
        this.permisoService.Permissions().subscribe(
            (data:any)=>{
            this.listaPermisos=this.permisoService.handlePermissions(data);
            

          },
          (error:any)=> this.error=this.permisoService.handleErrorPermission(error));

        this.operadoresService.verOperatorsSimple(this.nombre).subscribe(
            (data:any)=>{
            this.operadores=this.operadoresService.handleOperatorSimple(data.data);
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
        this.permisoService.Permissions().subscribe(
            (data:any)=>{
            this.listaPermisos=this.permisoService.handlePermissions(data);
            

          },
          (error:any)=> this.error=this.permisoService.handleErrorPermission(error));
    }
    delete(event:any){
        this.permisoService.eliminarPermission(event.id).subscribe(
            (data:any)=>{
                this.permisoService.Permissions().subscribe(
                    (data:any)=>{
                    this.listaPermisos=this.permisoService.handlePermissions(data);
        
                  },
                  (error:any)=> this.error=this.permisoService.handleErrorPermission(error));
                this.notify.success(data.message,'Eliminado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
            

          },
          (error:any)=> {
            this.error=this.permisoService.handleErrorPermission(error);
            this.notify.error(error.message,'No se realizo la operacion',{timeOut:2500,positionClass: 'toast-top-right'});
            
        });
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(permiso:IPermiso) {
        this.permiso = { ...permiso }; 
        
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = true;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
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
        for (let i = 0; i < this.listaPermisos.length; i++) {
            if (this.listaPermisos[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
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

    eliminarDialogo(permiso:IPermiso){
        
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Eliminar este Permiso?',
            accept: () => {
                this.delete(permiso);
              },
        });
    }
}
