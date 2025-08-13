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
import { ITipoTransporte } from '@data/tipo_transporte.metadata';
import { TipoTransporteService } from 'src/app/admin/services/tipo-transporte.service';



@Component({
    templateUrl: './listar-tipo-transporte.component.html',
    providers: [MessageService]
})
export class ListarTipoTransporteComponent implements OnInit {

    public listaTipoTransportes!:ITipoTransporte[];


    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre:string='fd';
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public tipoTransporte:ITipoTransporte={
        id: null,
        nombre: null,
        capacidad:null
    };
    public submitted = true;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private tipoTransporteService:TipoTransporteService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
    ) {

        this.operador_id= 0;

    }

    ngOnInit() {
        this.tipoTransporteService.verTipoTransportes(this.operador_id.toString()).subscribe(
            (data:any)=>{
            this.listaTipoTransportes=this.tipoTransporteService.handleTipoTransportes(data);
          },
          (error:any)=> this.error=this.tipoTransporteService.handleError(error));

        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'capacidad', header: 'Capacidad' },
        ];

    }
    cerrar(event:any){
        this.productDialog=event;
        this.tipoTransporteService.verTipoTransportes(this.operador_id.toString()).subscribe(
            (data:any)=>{
            this.listaTipoTransportes=this.tipoTransporteService.handleTipoTransportes(data);
          },
          (error:any)=> this.error=this.tipoTransporteService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(tipoTransporte:any) {
        // Crear una copia del objeto, excluyendo el campo "operador"
        const { operador, ...rest } = tipoTransporte;

        // Asignar el resto de las propiedades al objeto tipoTransporte
        this.tipoTransporte = { ...rest };
        console.log(this.tipoTransporte);
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
        for (let i = 0; i < this.listaTipoTransportes.length; i++) {
            if (this.listaTipoTransportes[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    bloquearDialogo(tipoTransporte:any){
    this.confirmationService.confirm({
        key: 'confirm1',
        message: '¿Estas seguro de Realizar esta Operación?',
        accept: () => {
        // Crear una copia del objeto, excluyendo el campo "operador"
        const { razon_social, ...rest } = tipoTransporte;

        // Asignar el resto de las propiedades al objeto tipoTransporte
        this.tipoTransporte = { ...rest };
       //
        this.tipoTransporteService.editarTipoTransporte(this.tipoTransporte).subscribe(
            (data:any) =>
            {
              this.tipoTransporteService.handleCreartipoTransporte(data);

              if(data.error==null)
              {
                this.notify.success('Actualizado Correctamente','Actualizado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                this.tipoTransporteService.verTipoTransportes(this.tipoTransporte.id.toString()).subscribe(
                    (data:any)=>{
                    this.listaTipoTransportes=this.tipoTransporteService.handleTipoTransportes(data);
                  },
                  (error:any)=> this.error=this.tipoTransporteService.handleError(error));
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
