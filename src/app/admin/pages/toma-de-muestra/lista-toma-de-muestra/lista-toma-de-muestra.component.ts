import { Component, OnInit } from '@angular/core';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { CanCrearFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-crear-formulario-interno.guard';
import { CanEditarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-editar-formulario-interno.guard';
import { CanListarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-listar-formulario-interno.guard';
import { CanVerFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-ver-formulario-interno.guard';
import { CanEliminarOperatorGuard } from 'src/app/admin/guards/operators/can-eliminar-operator.guard';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';
import { ITomaDeMuestra } from '@data/toma_de_muestra.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { ITomaDeMuestraSimple } from '@data/toma_de_muestra_simple.metadata';
import { IAprobarTM } from '@data/aprobar_tm.metadata';
import { PdfTomaDeMuestraService } from 'src/app/admin/services/pdf/toma-de-muestra-pdf.service';
import { ITomaDeMuestraPDF } from '@data/toma_de_muestra_pdf.metadata';
import { CanVerTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-ver-toma-de-muestra.guard';
import { CanCrearTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-crear-toma-de-muestra.guard';
import { CanEditarTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-editar-toma-de-muestra.guard';
import { CanEliminarTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-eliminar-toma-de-muestra.guard';
import { CanImprimirTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-imprimir-toma-de-muestra.guard';
import { CanSolicitarTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-solicitar-toma-de-muestra.guard';
import { CanAprobarTomaDeMuestraGuard } from 'src/app/admin/guards/toma-de-muestra/can-aprobar-toma-de-muestra.guard';

@Component({
  selector: 'app-lista-toma-de-muestra',
  templateUrl: './lista-toma-de-muestra.component.html',
  styleUrls: ['./lista-toma-de-muestra.component.scss']
})
export class ListaTomaDeMuestraComponent implements OnInit {


    public listaTomaDeMuestras!:ITomaDeMuestraSimple[];
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
        responsable_tdm_id:null,
        operador_id:null,
        created_at:null,
        updated_at:null
    }
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public submitted = true;
    public operador_id:number=0;
    public isEditMode:boolean=true;
    public aprobartdm:IAprobarTM={
        id:null,
        estado:null,
        observaciones:null,
        responsable_tdm_senarecom_id:null,
        procedimiento:[]
    }
    public verDialog:boolean=false;
    public toma_de_muestra_id:number=null;
    public tdm_completo:ITomaDeMuestraPDF;

    constructor(
        public canListarFormularioInterno:CanListarFormularioInternoGuard,
        public canVerTomaDeMuestra:CanVerTomaDeMuestraGuard,
        public canCrearTomaDeMuestra:CanCrearTomaDeMuestraGuard,
        public canEditarTomaDeMuestra:CanEditarTomaDeMuestraGuard,
        public canEliminarTomaDeMuestra:CanEliminarTomaDeMuestraGuard,
        public canPrintTomaDeMuestra:CanImprimirTomaDeMuestraGuard,
        public canSolicitarTomaDeMuestra:CanSolicitarTomaDeMuestraGuard,
        public canAprobarTomaDeMuestraGuard:CanAprobarTomaDeMuestraGuard,
        public tomaDeMuestraService:TomaDeMuestraService,
        public pdfTomaDemuestra:PdfTomaDeMuestraService,
        private notify:ToastrService,
        private authService:AuthService,
        private confirmationService:ConfirmationService
    ) {
        this.operador_id= authService.getUser.operador_id;

    }

    ngOnInit() {
        this.tomaDeMuestraService.verTomaDeMuestrasSimple().subscribe(
            (data:any)=>{
            this.listaTomaDeMuestras=this.tomaDeMuestraService.handleTomaDeMuestraSimple(data);
          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));


        //this.productService.getProducts().then(data => this.products = data);

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
        for (let i = 0; i < this.listaTomaDeMuestras.length; i++) {
            if (this.listaTomaDeMuestras[i].nro_formulario === id) {
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

        this.tomaDeMuestraService.solicitarTomaDeMuestra(event.id).subscribe(
            (data:any)=>{

          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
    }
    confirmarSolicitud(event:ITomaDeMuestra) {

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Solicitar la Toma de Muestra: '+event.nro_formulario+'?',
            accept: () => {
                this.solicitar(event); // Llama a onSubmit cuando el usuario acepta
              },
        });
    }
    aprobarSolicitud(event:ITomaDeMuestraSimple){
        this.tomaDeMuestra=event;
        this.productDialog = true;
        this.isEditMode = true;
    }
    cerrar(event:any){
        this.productDialog=event;
        this.tomaDeMuestraService.verTomaDeMuestrasSimple().subscribe(
            (data:any)=>{
            this.listaTomaDeMuestras=this.tomaDeMuestraService.handleTomaDeMuestraSimple(data);
          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
    }
    verSolicitud(event:ITomaDeMuestraSimple){
        this.tomaDeMuestra=event;
        this.verDialog = true;
        this.toma_de_muestra_id=event.id;
    }


}
