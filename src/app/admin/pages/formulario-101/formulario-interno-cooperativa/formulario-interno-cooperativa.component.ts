import { Component, OnInit } from '@angular/core';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { CanCrearFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-crear-formulario-interno.guard';
import { CanEditarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-editar-formulario-interno.guard';
import { CanListarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-listar-formulario-interno.guard';
import { CanVerFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-ver-formulario-interno.guard';
import { CanEliminarOperatorGuard } from 'src/app/admin/guards/operators/can-eliminar-operator.guard';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';
import { Table } from 'primeng/table';
import { PdfFormularioInternoService } from 'src/app/admin/services/pdf/formulario-interno-pdf.service';
import { ToastrService } from 'ngx-toastr';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { ConfirmationService } from 'primeng/api';
import { CanAnularFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-anular-formulario-interno.guard';
import { CanImprimirFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-imprimir-formulario-interno.guard';
import { FormularioCooperativaService } from 'src/app/admin/services/formulario-interno-cooperativa/formulario-cooperativa.service';

@Component({
  selector: 'app-formulario-interno-cooperativa',
  templateUrl: './formulario-interno-cooperativa.component.html',
  styleUrls: ['./formulario-interno-cooperativa.component.scss']
})
export class FormularioInternoCooperativaComponent implements OnInit {


    public listaFormularioInternos!:IFormularioInternoSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public submitted = true;

    constructor(
        public canListarFormularioInterno:CanListarFormularioInternoGuard,
        public canVerFormularioInterno:CanVerFormularioInternoGuard,
        public canCrearFormularioInterno:CanCrearFormularioInternoGuard,
        public canEditarFormularioInterno:CanEditarFormularioInternoGuard,
        public canEliminarFormularioInterno:CanEliminarOperatorGuard,
        public canAnularFormularioInterno:CanAnularFormularioInternoGuard,
        public canImprimirFormularioInterno:CanImprimirFormularioInternoGuard,
        public formularioInternoService:FormularioCooperativaService,
        public pdfFormularioInterno:PdfFormularioInternoService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService
    ) {
     }

    ngOnInit() {
        this.formularioInternoService.verFormularioCooperativaSimple(this.nombre).subscribe(
            (data:any)=>{
            this.listaFormularioInternos=this.formularioInternoService.handleFormularioInternoSimple(data);
          },
          (error:any)=> this.error=this.formularioInternoService.handleError(error));


        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

    }

    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
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
    findIndexById(id: string): string {
        let index = -1;
        for (let i = 0; i < this.listaFormularioInternos.length; i++) {
            if (this.listaFormularioInternos[i].nro_formulario === id) {
                index = i;
                break;
            }
        }

        return index.toString();
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    generarPDF(formulario_interno:IFormularioInternoSimple){
        this.pdfFormularioInterno.generarPDF(formulario_interno);
    }
    emitir(event:IFormularioInternoSimple){
        let emitido:any=null;
        this.formularioInternoService.emitirFormularioInterno(event.id).subscribe(
            (data:any)=>{
                let formulario_emitido:IFormularioInterno
                formulario_emitido=data.form;
                if(formulario_emitido!=null)
                {
                    let index = this.listaFormularioInternos.findIndex(i => i.id === formulario_emitido.id);
                    if (index !== -1) {
                        this.listaFormularioInternos[index].estado = formulario_emitido.estado; // Actualizamos el valor
                        this.listaFormularioInternos[index].fecha_creacion=formulario_emitido.fecha_creacion;
                        this.listaFormularioInternos[index].fecha_vencimiento=formulario_emitido.fecha_vencimiento;
                        this.listaFormularioInternos[index].nro_formulario=formulario_emitido.nro_formulario;
                    }
                    this.notify.success('El el formulario interno '+formulario_emitido.nro_formulario+' se emitió exitosamente','Emitido Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                }
          },
          (error:any) =>
            {
                this.notify.error('Falló...Revise los datos y vuelva a enviar....','Error con la Emisión del Formulario',{timeOut:2000,positionClass: 'toast-top-right'});
            });
    }
    confirmarEmision(event:IFormularioInternoSimple) {
        console.log
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Emitir el formulario '+event.nro_formulario+'?',
            accept: () => {
                this.emitir(event); // Llama a onSubmit cuando el usuario acepta
              },
        });
    }

}
