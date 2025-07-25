import { CanEditarPreRegistroGuard } from './../../guards/preregistro/can-editar-preregistro.guard';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CanCrearOperatorGuard } from '../../guards/operators/can-crear-operator.guard';
import { CanEditarOperatorGuard } from '../../guards/operators/can-editar-operator.guard';
import { CanEliminarOperatorGuard } from '../../guards/operators/can-eliminar-operator.guard';
import { IDOMService } from '../../services/pdf/idom.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PreRegistroService } from '../../services/pre-registro.service';
import { IOperator } from '@data/operator.metadata';
import { CanEliminarPreRegistroGuard } from '../../guards/preregistro/can-eliminar-preregistro.guard';
import { preRegistroService } from '../operator/crear-operador-validacion/preregistro.service';


@Component({
    templateUrl: './preregistro.component.html',
    styleUrls: ['./preregistro.component.scss'],
    providers: [MessageService]
})
export class PreRegistroComponent implements OnInit {

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
    //---------------------variables para optimizacion de listado-----------------------
        @ViewChild('dt') dt!: Table;
        loading: boolean = true;
        totalRecords: number = 0;
        rows: number = 30;
        // Variables para ordenamiento
        sortField: string = 'id';
        sortOrder: number = -1;
        searchTerm: string = '';

    constructor(
        private messageService: MessageService,
        private preRegistroService:PreRegistroService,
        public canCrearOperator:CanCrearOperatorGuard,
        public canEditarOperator:CanEditarPreRegistroGuard,
        public canEliminarOperator:CanEliminarPreRegistroGuard,
        public idomServices:IDOMService,
        private confirmationService:ConfirmationService,
        private notify:ToastrService,
        private router: Router,
        private preRegistroServices:preRegistroService

    ) { }

    ngOnInit() {
        this.loadData()
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
    loadData() {

        this.loading = true;
        this.preRegistroService.verPreRegistros(
          this.dt?.first / this.rows + 1 || 1,
          this.rows,
          this.searchTerm,
          this.sortField,
          this.sortOrder
        ).subscribe({
          next: (response) => {
            this.listaOperadores = response.data;
            this.totalRecords = response.total;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error:', err);
            this.loading = false;
          }
        });
      }
      onSort(event: any) {
        this.sortField = event.field;
        this.sortOrder = event.order;
        this.loadData();
      }
    onPageChange(event: any) {
        const page = event.first / event.rows + 1;
        this.loadData();
        }
    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchTerm = value;  // <-- Almacena el término de búsqueda
        this.dt.first = 0;       // <-- Reinicia a la primera página
        this.loadData();         // <-- Vuelve a cargar los datos

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

    generarIDOM(operador:IOperator){
        this.idomServices.generarPDF(operador);
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
    editarOperador(operador:IOperator){
        console.log(operador);
        this.router.navigate(['/admin/operador/editar', operador.id]);
    }
    crearOperador(operador: IOperator) {
    this.preRegistroServices.setOperador(operador);
    this.router.navigate(['/admin/operador/crear']);
}
}
