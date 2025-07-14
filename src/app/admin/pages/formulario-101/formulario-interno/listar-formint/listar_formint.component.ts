import { Component, OnInit, ViewChild } from "@angular/core";
import { IFormularioInterno } from "@data/formulario_interno.metadata";
import { IFormularioInternoPDF } from "@data/formulario_interno_pdf.metadata";
import { IFormularioInternoSimple } from "@data/formulario_interno_simple.metadata";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService } from "primeng/api";
import { Table } from "primeng/table";
import { CanAnularFormularioInternoGuard } from "src/app/admin/guards/formulario-internos/can-anular-formulario-interno.guard";
import { CanCrearFormularioInternoGuard } from "src/app/admin/guards/formulario-internos/can-crear-formulario-interno.guard";
import { CanEditarFormularioInternoGuard } from "src/app/admin/guards/formulario-internos/can-editar-formulario-interno.guard";
import { CanImprimirFormularioInternoGuard } from "src/app/admin/guards/formulario-internos/can-imprimir-formulario-interno.guard";
import { CanListarFormularioInternoGuard } from "src/app/admin/guards/formulario-internos/can-listar-formulario-interno.guard";
import { CanVerFormularioInternoGuard } from "src/app/admin/guards/formulario-internos/can-ver-formulario-interno.guard";
import { CanEliminarOperatorGuard } from "src/app/admin/guards/operators/can-eliminar-operator.guard";
import { FormularioInternosService } from "src/app/admin/services/formulario-interno/formulariosinternos.service";
import { PdfFormularioInternoService } from "src/app/admin/services/pdf/formulario-interno-pdf.service";
import { TrancaDetailComponent } from "./components/control-tranca-detalle.component";
import { DialogService } from "primeng/dynamicdialog";

@Component({
  selector: 'app-listar_formint',
  templateUrl: './listar_formint.component.html',
  styleUrls: ['./listar_formint.component.scss']
})
export class ListarFormularioInternoComponent implements OnInit {

    @ViewChild('dt') dt!: Table;
    public error!:any;
    listaFormularioInternos: IFormularioInternoSimple[] = [];
    cols: any[] = [];
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
        public canEliminarFormularioInterno:CanEliminarOperatorGuard,
        public canAnularFormularioInterno:CanAnularFormularioInternoGuard,
        public canImprimirFormularioInterno:CanImprimirFormularioInternoGuard,
        public pdfFormularioInterno:PdfFormularioInternoService,
        private confirmationService:ConfirmationService,
        private notify:ToastrService,
        private dialogService: DialogService,
        private formIntService: FormularioInternosService
    ) { }

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
        this.formIntService.getFormReducidoOptimizado(
          this.dt?.first / this.rows + 1 || 1,
          this.rows,
          this.searchTerm,
          this.sortField,
          this.sortOrder
        ).subscribe({
          next: (response) => {
            console.log('Response:', response.data);
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
            this.formIntService.verFormularioInternoPDF(formulario_interno.id.toString()).subscribe(
                        (data:any)=>{
                        let tdm_completo:IFormularioInternoPDF=this.formIntService.handleFormularioInternoPDF(data);

                        this.pdfFormularioInterno.generarPDF(tdm_completo);
                      },
                      (error:any)=> this.error=this.formIntService.handleError(error));
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
    emitir(event:IFormularioInternoSimple){
            let emitido:any=null;
            this.formIntService.emitirFormularioInterno(event.id).subscribe(
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
