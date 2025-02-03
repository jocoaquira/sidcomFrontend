import { Component, OnInit } from '@angular/core';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { CanCrearFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-crear-formulario-interno.guard';
import { CanEditarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-editar-formulario-interno.guard';
import { CanListarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-listar-formulario-interno.guard';
import { CanVerFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-ver-formulario-interno.guard';
import { CanEliminarOperatorGuard } from 'src/app/admin/guards/operators/can-eliminar-operator.guard';
import { Table } from 'primeng/table';
import { PdfFormularioInternoService } from 'src/app/admin/services/pdf/formulario-interno-pdf.service';
import { ToastrService } from 'ngx-toastr';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { ConfirmationService } from 'primeng/api';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';
import { ITomaDeMuestra } from '@data/toma_de_muestra.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { ITomaDeMuestraSimpleOperador } from '@data/toma_de_muestra_simple_operador.metadata';

@Component({
  selector: 'app-lista-toma-de-muestra',
  templateUrl: './lista-toma-de-muestra.component.html',
  styleUrls: ['./lista-toma-de-muestra.component.scss']
})
export class ListaTomaDeMuestraComponent implements OnInit {


    public listaTomaDeMuestra!:ITomaDeMuestraSimpleOperador[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public submitted = true;
    public operador_id:number=0;

    constructor(
        public canListarFormularioInterno:CanListarFormularioInternoGuard,
        public canVerFormularioInterno:CanVerFormularioInternoGuard,
        public canCrearFormularioInterno:CanCrearFormularioInternoGuard,
        public canEditarFormularioInterno:CanEditarFormularioInternoGuard,
        public canEliminarFormularioInterno:CanEliminarOperatorGuard,
        public tomaDeMuestraService:TomaDeMuestraService,
        public pdfFormularioInterno:PdfFormularioInternoService,
        private notify:ToastrService,
        private authService:AuthService,
        private confirmationService:ConfirmationService
    ) {
        this.operador_id= authService.getUser.operador_id;
        console.log(this.operador_id);
    }

    ngOnInit() {
        this.tomaDeMuestraService.verTomaDeMuestrasSimpleOperador(this.operador_id).subscribe(
            (data:any)=>{
            this.listaTomaDeMuestra=this.tomaDeMuestraService.handleTomaDeMuestraOperadorSimple(data);
          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));


        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'nro_formulario', header: 'Nro de Formulario' },
            { field: 'fecha_hora_tdm', header: 'Fecha de Muestra' },
            { field: 'category', header: 'Category' },
            { field: 'responsable_tdm_id', header: 'Reviews' },
            { field: 'estado', header: 'Status' }
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
        for (let i = 0; i < this.listaTomaDeMuestra.length; i++) {
            if (this.listaTomaDeMuestra[i].nro_formulario === id) {
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
    
    solicitar(event:ITomaDeMuestra){
        console.log(event);
        this.tomaDeMuestraService.solicitarTomaDeMuestra(event.id).subscribe(
            (data:any)=>{
            console.log(this.tomaDeMuestraService.handleTomaDeMuestraOperadorSimple(data));
            this.tomaDeMuestraService.verTomaDeMuestrasSimpleOperador(this.operador_id).subscribe(
                (data:any)=>{
                this.listaTomaDeMuestra=this.tomaDeMuestraService.handleTomaDeMuestraOperadorSimple(data);
              },
              (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
    }
    confirmarSolicitud(event:ITomaDeMuestra) {
        console.log
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Solicitar la Toma de Muestra: '+event.nro_formulario+'?',
            accept: () => {
                this.solicitar(event); // Llama a onSubmit cuando el usuario acepta
              },
        });
    }
    

}
