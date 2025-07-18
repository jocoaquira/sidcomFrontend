import { Component, OnInit, ViewChild } from '@angular/core';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { Table } from 'primeng/table';
import { PdfFormularioInternoService } from 'src/app/admin/services/pdf/formulario-interno-pdf.service';
import { ToastrService } from 'ngx-toastr';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { ConfirmationService } from 'primeng/api';
import { FormularioCooperativaService } from 'src/app/admin/services/formulario-interno-cooperativa/formulario-cooperativa.service';
import { CanListarFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-listar-formulario-cooperativa.guard';
import { CanVerFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-ver-formulario-cooperativa.guard';
import { CanCrearFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-crear-formulario-cooperativa.guard';
import { CanEditarFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-editar-formulario-cooperativa.guard';
import { CanEliminarFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-eliminar-formulario-cooperativa.guard';
import { CanAnularFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-anular-formulario-cooperativa.guard';
import { CanImprimirFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-imprimir-formulario-cooperativa.guard';
import { PdfFormularioInternoCooperativaService } from 'src/app/admin/services/pdf/formulario-cooperativa-pdf.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TrancaDetailComponent } from '../components/control-tranca-detalle.component';

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
    public operador_id:number=null;
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
        public canListarFormularioCooperativa:CanListarFormularioCooperativaGuard,
        public canVerFormularioCooperativa:CanVerFormularioCooperativaGuard,
        public canCrearFormularioCooperativa:CanCrearFormularioCooperativaGuard,
        public canEditarFormularioCooperativa:CanEditarFormularioCooperativaGuard,
        public canEliminarFormularioCooperativa:CanEliminarFormularioCooperativaGuard,
        public canAnularFormularioCooperativa:CanAnularFormularioCooperativaGuard,
        public canImprimirFormularioCooperativa:CanImprimirFormularioCooperativaGuard,

        public formularioInternoService:FormularioCooperativaService,
        public pdfFormularioInterno:PdfFormularioInternoCooperativaService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
        private authService:AuthService,
        private dialogService: DialogService,
    ) {
        this.operador_id= authService.getUser.operador_id;
     }

    ngOnInit() {
        this.cols = [
            { field: 'nro_formulario', header: 'Número' },
            { field: 'razon_social', header: 'Operador' },
            { field: 'fecha_creacion', header: 'Fecha Creación' },
            { field: 'estado', header: 'Estado' },
            { field: 'fecha_vencimiento', header: 'Vencimiento' }
          ];
          this.loadData();

    }
    loadData() {

        this.loading = true;
        this.formularioInternoService.getFormReducidoOperadorOptimizado(
          this.dt?.first / this.rows + 1 || 1,
          this.rows,
          this.searchTerm,
          this.sortField,
          this.sortOrder,
          this.operador_id
        ).subscribe({
          next: (response) => {
            this.listaFormularioInternos = response.data;
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
    generarPDF(formulario_interno:IFormularioInternoSimple){
        this.formularioInternoService.verFormularioInternoCooperativaPDF(formulario_interno.id.toString()).subscribe(
            (data:any)=>{
            let tdm_completo=this.formularioInternoService.handleFormularioInternoCooperativaPDF(data);
            this.pdfFormularioInterno.generarPDF(tdm_completo);
          },
          (error:any)=> this.error=this.formularioInternoService.handleError(error));
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

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Emitir el formulario '+event.nro_formulario+'?',
            accept: () => {
                this.emitir(event); // Llama a onSubmit cuando el usuario acepta
              },
        });
    }
    showTrancaDetail(tranca: any) {
        const ref = this.dialogService.open(TrancaDetailComponent, {
        header: 'Detalle del Control en Tranca',
        width: '35%',
        data: {
            trancaData: tranca
        }
        });
    }
}
