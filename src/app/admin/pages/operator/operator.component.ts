import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IOperator } from '@data/operator.metadata';
import { OperatorsService } from '../../services/operators.service';
import { CanCrearOperatorGuard } from '../../guards/operators/can-crear-operator.guard';
import { CanEditarOperatorGuard } from '../../guards/operators/can-editar-operator.guard';
import { CanEliminarOperatorGuard } from '../../guards/operators/can-eliminar-operator.guard';
import { IDOMService } from '../../services/pdf/idom.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    templateUrl: './operator.component.html',
    styleUrls: ['./operador.component.scss'],
    providers: [MessageService]
})
export class OperatorComponent implements OnInit {

    public listaOperadores!:IOperator[];
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
        private operatorsService:OperatorsService,
        public canCrearOperator:CanCrearOperatorGuard,
        public canEditarOperator:CanEditarOperatorGuard,
        public canEliminarOperator:CanEliminarOperatorGuard,
        public idomServices:IDOMService,
        private confirmationService:ConfirmationService,
        private notify:ToastrService

    ) { }

    ngOnInit() {
        this.operatorsService.veroperators(this.nombre).subscribe(
            (data:any)=>{

            this.listaOperadores=this.operatorsService.handleoperator(data);
          },
          (error:any)=> this.error=this.operatorsService.handleError(error));


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

    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
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

    saveProduct() {
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
        for (let i = 0; i < this.listaOperadores.length; i++) {
            if (this.listaOperadores[i].id === id) {
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
    generarIDOM(operador:IOperator){
        this.idomServices.generarPDF(operador);
    }

    bloquearDialogo(operador:IOperator){

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Realizar esta Operación?',
            accept: () => {
                if(operador.estado=='ACTIVO')
                    {
                        operador.estado='INACTIVO';
                    }
                    else{
                        operador.estado='ACTIVO';
                    }

                this.operatorsService.editBloqueo(operador).subscribe(
                    (data:any) =>
                    {
                        this.operatorsService.handleCrearoperator(data);

                        if(data.error==null)
                        {
                        this.operatorsService.veroperators('nada').subscribe(
                            (data:any)=>{
                            this.listaOperadores=this.operatorsService.handleoperator(data);

                            },
                            (error:any)=> this.error=this.operatorsService.handleError(error));

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

    async abrirPdf(nitLink: string) {
        const baseUrl = localStorage.getItem('url-backend');
        const formattedNitLink = nitLink.replace(/\\/g, '/');
        const fullUrl = `${baseUrl}${formattedNitLink}`;

        try {
            // Descarga el PDF como Blob
            const response = await fetch(fullUrl);
            const blob = await response.blob();

            // Crea una URL local para el Blob
            const blobUrl = URL.createObjectURL(blob);

            // Abre el PDF en una nueva pestaña (sin mostrar la URL del API)
            window.open(blobUrl, '_blank');

            // Libera la memoria después de 10 segundos (opcional)
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        } catch (error) {
            console.error('Error al cargar el PDF', error);
        }
    }
    openGoogleMaps(lat: number, lon: number) {
        if (lat && lon) {
            const url = `https://www.google.com/maps?q=${lat},${lon}`;
            window.open(url, '_blank');
        } else {
            console.warn('Coordenadas no disponibles');
            // Opcional: Mostrar mensaje al usuario
        }
    }
}
