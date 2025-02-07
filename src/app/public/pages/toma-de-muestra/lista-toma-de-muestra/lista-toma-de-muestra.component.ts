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
import { ITomaDeMuestraSimple } from '@data/toma_de_muestra_simple.metadata';
import { ITomaDeMuestraPDF } from '@data/toma_de_muestra_pdf.metadata';
import { PdfTomaDeMuestraService } from 'src/app/admin/services/pdf/toma-de-muestra-pdf.service';

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
    public tdm_completo:ITomaDeMuestraPDF;
    public tomaDeMuestra:ITomaDeMuestraSimple={
        id:null,
        nro_formulario:null,
        fecha_hora_tdm:null,
        razon_social:null,
        estado:null,
        fecha_aprobacion:null,
        fecha_firma:null,
        lugar_verificacion:null,
        ubicacion_lat:null,
        ubicacion_lon:null,
        created_at:null,
        updated_at:null
    }
    public toma_de_muestra_id:number=null;
    public verDialog:boolean=false;

    constructor(
        public canListarFormularioInterno:CanListarFormularioInternoGuard,
        public canVerFormularioInterno:CanVerFormularioInternoGuard,
        public canCrearFormularioInterno:CanCrearFormularioInternoGuard,
        public canEditarFormularioInterno:CanEditarFormularioInternoGuard,
        public canEliminarFormularioInterno:CanEliminarOperatorGuard,
        public tomaDeMuestraService:TomaDeMuestraService,
        private pdfTomaDemuestra:PdfTomaDeMuestraService,
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
                console.log(this.listaTomaDeMuestra);
        },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));


        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'nro_formulario', header: 'Nro. de Formulario' },
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
    generarPDF(tdm:IFormularioInternoSimple){
        console.log(tdm);
        this.tomaDeMuestraService.verTomaDeMuestraPDF(tdm.id.toString()).subscribe(
            (data:any)=>{
            this.tdm_completo=this.tomaDeMuestraService.handleTomaDeMuestraPDF(data);
            console.log(this.tdm_completo);
            this.pdfTomaDemuestra.generarPDF(this.tdm_completo);
          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
        
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
    firmar(event:ITomaDeMuestra){
        console.log(event);
        this.tomaDeMuestraService.firmarTomaDeMuestra(event.id).subscribe(
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
    firmarTDM(event:ITomaDeMuestra){
        console.log
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Firmar la Toma de Muestra: '+event.nro_formulario+'?',
            accept: () => {
                this.firmar(event); // Llama a onSubmit cuando el usuario acepta
              },
        });
    }
    verSolicitud(event:ITomaDeMuestraSimple){   
            this.tomaDeMuestra=event;
            this.verDialog = true;
            this.toma_de_muestra_id=event.id;
        }
    cerrar(event:any){
        this.productDialog=event;
        this.tomaDeMuestraService.verTomaDeMuestrasSimple().subscribe(
            (data:any)=>{
                this.listaTomaDeMuestra=this.tomaDeMuestraService.handleTomaDeMuestraOperadorSimple(data);
            },
            (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
    }

}
