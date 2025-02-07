import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';
import { RolesService } from 'src/app/admin/services/roles.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IProcedimiento } from '@data/procedimiento_tm.metadata';
import { ProcedimientoService } from 'src/app/admin/services/toma-de-muestra/procedimiento-tm.service';



@Component({
    templateUrl: './listar-procedimiento-tm.component.html',
    providers: [MessageService]
})
export class ListarProcedimientoTMComponent implements OnInit {

    public listaProcedimientos!:IProcedimiento[];
    public procedimiento:IProcedimiento={
        id: null,
        nombre:null,
        procedimiento:null
    };
    public roles!:IRol[];
    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public productDialog1=false;
    public isEditMode: boolean = false;
    public responsable:IProcedimiento={
        id: null,
        nombre:null,
        procedimiento:null
    };
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private procedimientoService:ProcedimientoService,
        private rolesServices:RolesService,
        private operadoresService:OperatorsService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
    ) { 
        this.operador_id= authService.getUser.operador_id
        console.log(this.operador_id);
    }

    ngOnInit() {
        this.procedimientoService.verProcedimientos().subscribe(
            (data:any)=>{
            this.listaProcedimientos=this.procedimientoService.handleProcedimientos(data);
            console.log(this.listaProcedimientos);

          },
          (error:any)=> this.error=this.procedimientoService.handleError(error));

        this.operadoresService.verOperatorsSimple(this.nombre).subscribe(
            (data:any)=>{
            this.operadores=this.operadoresService.handleOperatorSimple(data.data);
        },
        (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));
        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'nombre', header: 'Nombre' },
            { field: 'procedimiento', header: 'Procedimiento' }
        ];
    }
    cerrar(event:any){
        this.productDialog=event;
        this.procedimientoService.verProcedimiento('nada').subscribe(
            (data:any)=>{
            this.listaProcedimientos=this.procedimientoService.handleProcedimientos(data);
            console.log(this.listaProcedimientos);

          },
          (error:any)=> this.error=this.procedimientoService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(responsable:any) {
        this.responsable = { ...responsable }; 
        console.log('respo:'+responsable.nombre)
        //this.submitted = false;
        this.productDialog1 = true;
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
        for (let i = 0; i < this.listaProcedimientos.length; i++) {
            if (this.listaProcedimientos[i].id === id) {
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
        return this.operadores[index].razon_social;
        }
        else{ return '';}


    }
    bloquearDialogo(responsable:IProcedimiento){
        if(responsable.estado=='ACTIVO')
        {
            responsable.estado='INACTIVO';
        }
        else{
            responsable.estado='ACTIVO';
        }
        this.procedimientoService.editarProcedimientoTM(responsable).subscribe(
            (data:any) =>
            {
              this.procedimientoService.handleCrearProcedimiento(data);
              console.log(data);
              if(data.error==null)
              {
                this.procedimientoService.verProcedimientos().subscribe(
                    (data:any)=>{
                    this.listaProcedimientos=this.procedimientoService.handleProcedimientos(data);
                    console.log(this.listaProcedimientos);
        
                  },
                  (error:any)=> this.error=this.procedimientoService.handleError(error));

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

    }
}
