import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';

import { IOperatorSimple } from '@data/operador_simple.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IControlTranca } from '@data/control_tranca.metadata';
import { ControlTrancaService } from 'src/app/admin/services/control_tranca.service';



@Component({
    templateUrl: './listar-control-tranca.component.html',
    providers: [MessageService]
})
export class ListarControlTrancaComponent implements OnInit {

    public listaControlTranca!:IControlTranca[];


    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre:string='fd';
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public control_tranca:IControlTranca={
        id: null,
        usuario_id: null,
        tranca_id:null,
        formint_id:null,
        fecha_inspeccion:null,
        observaciones:null,
    };
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private controlTrancaService:ControlTrancaService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
    ) {

        this.operador_id=0

    }

    ngOnInit() {
        this.controlTrancaService.verControlTranca(this.operador_id.toString()).subscribe(
            (data:any)=>{
            this.listaControlTranca=this.controlTrancaService.handleListarControlTrancas(data);
          },
          (error:any)=> this.error=this.controlTrancaService.handleError(error));

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
        this.controlTrancaService.verControlTranca(this.operador_id.toString()).subscribe(
            (data:any)=>{
            this.listaControlTranca=this.controlTrancaService.handleListarControlTrancas(data);
          },
          (error:any)=> this.error=this.controlTrancaService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(control_tranca:any) {
        // Crear una copia del objeto, excluyendo el campo "operador"
        const { operador, ...rest } = control_tranca;

        // Asignar el resto de las propiedades al objeto control_tranca
        this.control_tranca = { ...rest };

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
        for (let i = 0; i < this.listaControlTranca.length; i++) {
            if (this.listaControlTranca[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    bloquearDialogo(control_tranca:any){
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Realizar esta Operación?',
            accept: () => {
        // Crear una copia del objeto, excluyendo el campo "operador"
        const { razon_social, ...rest } = control_tranca;
        console.log(control_tranca);
        // Asignar el resto de las propiedades al objeto control_tranca
        this.control_tranca = { ...rest };
       //
       console.log(this.control_tranca);

        this.controlTrancaService.editarControlTranca(this.control_tranca).subscribe(
            (data:any) =>
            {
              this.controlTrancaService.handleCrearControlTranca(data);

              if(data.error==null)
              {
                this.notify.success('Actualizado Correctamente','Actualizado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                this.controlTrancaService.verControlTranca(this.control_tranca.id.toString()).subscribe(
                    (data:any)=>{
                    this.listaControlTranca=this.controlTrancaService.handleListarControlTrancas(data);



                  },
                  (error:any)=> this.error=this.controlTrancaService.handleError(error));
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
