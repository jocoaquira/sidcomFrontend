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
import { PdfTomaDeMuestraParcialService } from 'src/app/admin/services/pdf/toma-de-muestra-parcial-pdf.service';
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
    public cerrarParcialDialog:boolean=false;
    public cerrarParcialTexto:string='';
    public cerrarParcialTarget:ITomaDeMuestraSimple=null;
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
        public pdfTomaDemuestraParcial:PdfTomaDeMuestraParcialService,
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
          1,
          1,
          this.searchTerm,
          this.sortField,
          this.sortOrder
        ).subscribe({
          next: (meta) => {
            const total = meta?.total ?? 0;
            if (!total) {
              this.listaTomaDeMuestras = [];
              this.totalRecords = 0;
              this.loading = false;
              return;
            }
            const pageSize = Math.max(total, this.rows);
            this.tomaDeMuestraService.getFormReducidoOptimizado(
              1,
              pageSize,
              this.searchTerm,
              this.sortField,
              this.sortOrder
            ).subscribe({
              next: (response) => {
                const allData = response.data || [];
                const parcialesMap = this.buildParcialesMap(allData);
                const padres = allData.filter((item: any) => !this.isParcialHijo(item));
                const ordenados = this.sortTomaDeMuestras(padres, parcialesMap);
                const first = this.dt?.first ?? 0;
                this.listaTomaDeMuestras = ordenados.slice(first, first + this.rows);
                // Debug: ver primer registro para verificar campos
                if (allData.length > 0) {
                  console.log('[ADMIN][TDM] first item:', allData[0]);
                  console.log('[ADMIN][TDM] parciales padre candidates:', allData.filter((item: any) =>
                    item?.procedimiento_parcial === 'INICIADO' || item?.generar_parcial === true
                  ));
                }
                this.totalRecords = ordenados.length;
                this.loading = false;
              },
              error: (err) => {
                console.error('Error:', err);
                this.loading = false;
              }
            });
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
    cerrarParcialPadre(event: ITomaDeMuestraSimple) {
        this.cerrarParcialTarget = event;
        this.cerrarParcialTexto = '';
        this.cerrarParcialDialog = true;
    }
    confirmarCerrarParcial() {
        if (!this.cerrarParcialTexto || !this.cerrarParcialTexto.trim()) {
            this.notify.error('Debe ingresar el detalle de cierre', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
            return;
        }
        if (!this.cerrarParcialTarget?.id) {
            this.notify.error('No se encontro el parcial padre', 'Error', { timeOut: 2000, positionClass: 'toast-top-right' });
            return;
        }
        this.tomaDeMuestraService.cerrarParcialPadre(this.cerrarParcialTarget.id, this.cerrarParcialTexto.trim()).subscribe(
            () => {
                this.cerrarParcialDialog = false;
                this.cerrarParcialTarget = null;
                this.cerrarParcialTexto = '';
                this.loadData();
            },
            (error: any) => this.error = this.tomaDeMuestraService.handleError(error)
        );
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

    private isParcialHijo(item: any): boolean {
        return item?.generar_parcial === true && item?.procedimiento_parcial == null;
    }

    private getParcialKey(item: any): string {
        return `${item?.lote ?? ''}::${item?.operador_id ?? ''}`;
    }

    private getFechaValue(item: any): number {
        const dateStr = item?.fecha_hora_tdm || item?.created_at;
        const time = dateStr ? new Date(dateStr).getTime() : 0;
        return Number.isNaN(time) ? 0 : time;
    }

    private buildParcialesMap(items: any[]): Map<string, any[]> {
        const map = new Map<string, any[]>();
        items.filter((item: any) => this.isParcialHijo(item)).forEach((child: any) => {
            const key = this.getParcialKey(child);
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)?.push(child);
        });
        return map;
    }

    private getEffectiveFecha(item: any, parcialesMap: Map<string, any[]>): number {
        const key = this.getParcialKey(item);
        const hijos = parcialesMap.get(key) || [];
        const solicitados = hijos.filter((hijo: any) => (hijo?.estado || '').trim() === 'SOLICITADO');
        const candidatos = solicitados.length ? solicitados : hijos;
        if (!candidatos.length) {
            return this.getFechaValue(item);
        }
        return candidatos
            .map((hijo: any) => this.getFechaValue(hijo))
            .reduce((max: number, val: number) => Math.max(max, val), 0);
    }

    private sortTomaDeMuestras(items: any[], parcialesMap: Map<string, any[]>): ITomaDeMuestraSimple[] {
        const order = this.sortOrder === 1 ? 1 : -1;
        if (this.sortField === 'fecha_hora_tdm' || this.sortField === 'id') {
            return items.slice().sort((a: any, b: any) =>
                (this.getEffectiveFecha(a, parcialesMap) - this.getEffectiveFecha(b, parcialesMap)) * order
            );
        }
        if (this.sortField === 'razon_social') {
            return items.slice().sort((a: any, b: any) => {
                const aVal = (a?.razon_social || '').toString().toLowerCase();
                const bVal = (b?.razon_social || '').toString().toLowerCase();
                return aVal.localeCompare(bVal) * order;
            });
        }
        return items.slice().sort((a: any, b: any) => {
            const aVal = a?.[this.sortField];
            const bVal = b?.[this.sortField];
            if (aVal == null && bVal == null) {
                return 0;
            }
            if (aVal == null) {
                return -1 * order;
            }
            if (bVal == null) {
                return 1 * order;
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return (aVal - bVal) * order;
            }
            return aVal.toString().localeCompare(bVal.toString()) * order;
        });
    }


}
