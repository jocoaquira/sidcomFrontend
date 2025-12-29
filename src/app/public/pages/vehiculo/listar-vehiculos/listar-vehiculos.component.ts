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
import { IVehiculo } from '@data/vehiculo.metadata';
import { VehiculoService } from 'src/app/admin/services/vehiculo.service';



@Component({
    templateUrl: './listar-vehiculos.component.html',
    providers: [MessageService]
})
export class ListarVehiculoComponent implements OnInit {

    public listaVehiculos!:IVehiculo[];


    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre:string='fd';
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public responsable:IVehiculo={
        id: null,
        placa: null,
        tipo:null,
        operador_id:null,
        estado:null,
    };
    public submitted = true;

    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private vehiculoService:VehiculoService,
        private operadoresService:OperatorsService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
    ) {

        this.operador_id= authService.getUser.operador_id;

    }

    ngOnInit() {
        this.vehiculoService.verVehiculoOperador(this.operador_id.toString()).subscribe(
            (data:any)=>{
            this.listaVehiculos=this.vehiculoService.handlevehiculo(data);
          },
          (error:any)=> this.error=this.vehiculoService.handleError(error));

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
        this.vehiculoService.verVehiculoOperador(this.operador_id.toString()).subscribe(
            (data:any)=>{
            this.listaVehiculos=this.vehiculoService.handlevehiculo(data);


          },
          (error:any)=> this.error=this.vehiculoService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(responsable:any) {
        // Crear una copia del objeto, excluyendo el campo "operador"
        const { operador, ...rest } = responsable;

        // Asignar el resto de las propiedades al objeto responsable
        this.responsable = { ...rest };
       //



        //this.responsable = { ...responsable };
        //
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
        for (let i = 0; i < this.listaVehiculos.length; i++) {
            if (this.listaVehiculos[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    bloquearDialogo(responsable:any){
    this.confirmationService.confirm({
        key: 'confirm1',
        message: '¿Estas seguro de Realizar esta Operación?',
        accept: () => {
        // Crear una copia del objeto, excluyendo el campo "operador"
        const { operador, ...rest } = responsable;

        // Asignar el resto de las propiedades al objeto responsable
        this.responsable = { ...rest };
       //
        if(this.responsable.estado=='ACTIVO')
        {
            this.responsable.estado='INACTIVO';
        }
        else{
            this.responsable.estado='ACTIVO';
        }
        this.vehiculoService.editarVehiculo(this.responsable).subscribe(
            (data:any) =>
            {
              this.vehiculoService.handleCrearvehiculo(data);

              if(data.error==null)
              {
                this.notify.success('Actualizado Correctamente','Actualizado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                this.vehiculoService.verVehiculoOperador(this.operador_id.toString()).subscribe(
                    (data:any)=>{
                    this.listaVehiculos=this.vehiculoService.handlevehiculo(data);



                  },
                  (error:any)=> this.error=this.vehiculoService.handleError(error));
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
