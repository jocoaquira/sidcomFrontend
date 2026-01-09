import { Component, OnInit, ViewChild } from '@angular/core';
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
        this.cols = [
            { field: 'nro_formulario', header: 'Nro. de Formulario' },
            { field: 'fecha_hora_tdm', header: 'Fecha de Muestra' },
            { field: 'razon_social', header: 'Operador' },
            { field: 'responsable_tdm_id', header: 'Responsable' },
            { field: 'estado', header: 'Estado' }
        ];
        this.loadData();
    }
    loadData() {

        this.loading = true;
        this.tomaDeMuestraService.getFormReducidoOptimizado(
          this.dt?.first / this.rows + 1 || 1,
          this.rows,
          this.searchTerm,
          this.sortField,
          this.sortOrder
        ).subscribe({
          next: (response) => {
            this.listaTomaDeMuestras = response.data;
            // Debug: ver primer registro para verificar campos
            if (response.data && response.data.length > 0) {
              console.log('Primer registro de muestra:', response.data[0]);
              console.log('¿Tiene generar_parcial?', 'generar_parcial' in response.data[0]);
            }
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
    generarPDF(tdm:IFormularioInternoSimple){

        this.tomaDeMuestraService.verTomaDeMuestraPDF(tdm.id.toString()).subscribe(
            (data:any)=>{
            this.tdm_completo=this.tomaDeMuestraService.handleTomaDeMuestraPDF(data);

            this.pdfTomaDemuestra.generarPDF(this.tdm_completo);
          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));

    }

    solicitar(event:ITomaDeMuestra){

        this.tomaDeMuestraService.solicitarTomaDeMuestra(event.id).subscribe(
            (data:any)=>{
                this.loadData();
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
        console.log(event);
        this.tomaDeMuestra=event;
        this.productDialog = true;
        this.isEditMode = true;
    }
    cerrar(event:any){
        this.productDialog=event;
        this.loadData();
     }
    verSolicitud(event:ITomaDeMuestraSimple){
        this.tomaDeMuestra=event;
        this.verDialog = true;
        this.toma_de_muestra_id=event.id;
    }


}
