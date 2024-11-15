import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IOperator } from '@data/operator.metadata';
import { OperatorsService } from '../../services/operators.service';
import { CanCrearOperatorGuard } from '../../guards/operators/can-crear-operator.guard';
import { CanEditarOperatorGuard } from '../../guards/operators/can-editar-operator.guard';
import { CanEliminarOperatorGuard } from '../../guards/operators/can-eliminar-operator.guard';
import { IDOMService } from '../../services/pdf/idom.service';


@Component({
    templateUrl: './operator.component.html',
    providers: [MessageService]
})
export class OperatorComponent implements OnInit {


    public usuario:IOperator={
        id:253,
        razon_social:'EMPRESA MIENRA ROMA VERA',
       act_ben_concentracion:null,
       act_comer_externa:null,
       act_comer_interna:null,
       act_exploracion:null,
       act_explotacion:null,
       act_fundicion:null,
       act_tostacion:null,
       act_calcinacion:null,
       act_industrializacion:null,
       act_refinacion:null,
       act_tras_colas:null,
        denominacion_area:'',
        dl_departamento:null,
        dl_direccion:'CALLE SIMPRE VIA NRO 4543 ENTRE PLAZA Y LUGAR DE REUNION',
        dl_municipio:null,
        dl_ubicacion:'',
        doc_creacion:'',
        fecha_exp_nim:'12/12/2024',
        fecha_exp_seprec:'',
        municipio_origen:'',
        nro_codigo_unico:'',
        nro_cuadricula:'',
        nro_matricula_seprec:'444345656',
        nro_nim:'02-4345-06',
        nro_personeria:'434545',
        nro_res_ministerial:null,
        nro_ruex:'',
        vencimiento_ruex:'',
        correo_inst:'',
        ofi_lat:'',
        ofi_lon:'',
        fax_op_min:'',
        tel_fijo:'5277777',
        celular:null,
        otro_celular:null,
        tipo_doc_creacion:null,
        tipo_explotacion:null,
        tipo_operador:null,
        verif_cert_liberacion:null,
        nit:234434565,
        nim_niar:null,
        fecha_creacion:'12/12/2023',
        fecha_actualizacion:'12/12/2024',
        fecha_expiracion:'12/12/2025',
        estado:null,
        verificacion_toma_muestra:null,
        comercio_interno_coperativa:null,
        traslado_colas:null,
        transbordo:null,
        nit_link:'',
        nim_link:'',
        seprec_link:'',
        doc_explotacion_link:'',
        ruex_link:'',
        resolucion_min_fundind_link:'',
        personeria_juridica_link:'',
        doc_creacion_estatal_link:'',
        ci_link:'',
        rep_nombre_completo:'RAUL GONZALES CHOQUE',
        rep_ci:'',
        rep_departamento_id:null,
        rep_municipio_id:null,
        rep_direccion:'',
        rep_telefono:null,
        rep_celular:22343456,
        rep_correo:'',
        observaciones:'',
    }




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
        public idomServices:IDOMService

    ) { }

    ngOnInit() {
        this.operatorsService.veroperators(this.nombre).subscribe(
            (data:any)=>{
                console.log(data);
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

    editProduct(product: Product) {
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
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
/*
        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }*/
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
}
