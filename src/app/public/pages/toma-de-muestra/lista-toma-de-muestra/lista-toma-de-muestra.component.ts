import { Component, OnInit, ViewChild } from '@angular/core';
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
import { PdfTomaDeMuestraParcialService } from 'src/app/admin/services/pdf/toma-de-muestra-parcial-pdf.service';
import { CanTDMParcialGuard } from 'src/app/admin/guards/toma-de-muestra/can-parcial.guard';

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
        responsable_tdm_id:null,
        operador_id:null,
        created_at:null,
        updated_at:null
    }
    public toma_de_muestra_id:number=null;
    public verDialog:boolean=false;
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
        public canVerFormularioInterno:CanVerFormularioInternoGuard,
        public canCrearFormularioInterno:CanCrearFormularioInternoGuard,
        public canEditarFormularioInterno:CanEditarFormularioInternoGuard,
        public canTDMParcial:CanTDMParcialGuard,
        public canEliminarFormularioInterno:CanEliminarOperatorGuard,
        public tomaDeMuestraService:TomaDeMuestraService,
        private pdfTomaDemuestra:PdfTomaDeMuestraService,
        private pdfTomaDemuestraParcial:PdfTomaDeMuestraParcialService,
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
        this.tomaDeMuestraService.getFormReducidoOperadorOptimizado(
          this.dt?.first / this.rows + 1 || 1,
          this.rows,
          this.searchTerm,
          this.sortField,
          this.sortOrder,
          this.operador_id
        ).subscribe({
          next: (response) => {
            console.log('[PUBLIC][TDM] getFormReducidoOperadorOptimizado response:', response);
            this.listaTomaDeMuestra = (response.data || []).filter((item: any) => {
              const isParcialHijo = item?.generar_parcial === true && item?.procedimiento_parcial == null;
              return !isParcialHijo;
            });
            if (response?.data?.length) {
              console.log('[PUBLIC][TDM] first item:', response.data[0]);
              console.log('[PUBLIC][TDM] parciales padre candidates:', response.data.filter((item: any) =>
                item?.procedimiento_parcial === 'INICIADO' || item?.generar_parcial === true
              ));
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

            const isParcialPadre = this.tdm_completo?.procedimiento_parcial === 'INICIADO'
              || this.tdm_completo?.procedimiento_parcial?.startsWith('EMITIDO');
            if (isParcialPadre) {
              this.pdfTomaDemuestraParcial.generarPDF(this.tdm_completo);
            } else {
              this.pdfTomaDemuestra.generarPDF(this.tdm_completo);
            }
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
    firmar(event:ITomaDeMuestra){

        this.tomaDeMuestraService.firmarTomaDeMuestra(event.id).subscribe(
            (data:any)=>{
                this.loadData();
          },
          (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
    }
    confirmarSolicitud(event:ITomaDeMuestra) {
        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Estas seguro de Solicitar la ' + this.getTipoMuestraLabel(event) + ': ' + event.nro_formulario + '?',
            accept: () => {
                this.solicitar(event); // Llama a onSubmit cuando el usuario acepta
              },
        });
    }
    firmarTDM(event:ITomaDeMuestra){

        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Estas seguro de Aprobar la ' + this.getTipoMuestraLabel(event) + ': ' + event.nro_formulario + '?',
            accept: () => {
                this.firmar(event); // Llama a onSubmit cuando el usuario acepta
              },
        });
    }
    cerrarParcialPadre(event: ITomaDeMuestra) {
        this.tomaDeMuestraService.cerrarParcialPadreOperador(event.id).subscribe(
            () => {
                this.loadData();
            },
            (error: any) => this.error = this.tomaDeMuestraService.handleError(error)
        );
    }
    confirmarCerrarParcialPadre(event: ITomaDeMuestra) {
        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Estas seguro de Cerrar la ' + this.getTipoMuestraLabel(event) + ': ' + event.nro_formulario + '?',
            accept: () => {
                this.cerrarParcialPadre(event);
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
                this.loadData();
            },
            (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
    }

    private getTipoMuestraLabel(event: ITomaDeMuestra): string {
        if (event?.generar_parcial === true) {
            return 'Muestra Parcial Padre';
        }
        if (event?.tipo_muestra === 'PARCIAL') {
            return 'Muestra Parcial';
        }
        return 'Toma de Muestra';
    }

}
