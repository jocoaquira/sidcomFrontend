import { Component, OnInit, ViewChild } from "@angular/core";
import { IFormularioExterno } from "@data/formulario_externo.metadata";
import { IFormularioExternoPDF } from "@data/formulario_externo_pdf.metadata";
import { IFormularioExternoSimple } from "@data/formulario_externo_simple.metadata";

import { ToastrService } from "ngx-toastr";
import { ConfirmationService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { Table } from "primeng/table";
import { CanAnularFormularioExternoGuard } from "src/app/admin/guards/formulario-externos/can-anular-formulario-externo.guard";
import { CanCrearFormularioExternoGuard } from "src/app/admin/guards/formulario-externos/can-crear-formulario-externo.guard";
import { CanEditarFormularioExternoGuard } from "src/app/admin/guards/formulario-externos/can-editar-formulario-externo.guard";
import { CanImprimirFormularioExternoGuard } from "src/app/admin/guards/formulario-externos/can-imprimir-formulario-externo.guard";
import { CanListarFormularioExternoGuard } from "src/app/admin/guards/formulario-externos/can-listar-formulario-externo.guard";
import { CanVerFormularioExternoGuard } from "src/app/admin/guards/formulario-externos/can-ver-formulario-externo.guard";
import { CanEliminarOperatorGuard } from "src/app/admin/guards/operators/can-eliminar-operator.guard";
import { FormularioExternosService } from "src/app/admin/services/formulario-externo/formulariosexternos.service";
import { PdfFormularioExternoService } from "src/app/admin/services/pdf/formulario-externo-pdf.service";
import { TrancaDetailComponent } from "./components/control-tranca-detalle.component";

@Component({
  selector: 'app-listar_formext',
  templateUrl: './listar_formext.component.html',
  styleUrls: ['./listar_formext.component.scss']
})
export class ListarFormularioExternoComponent implements OnInit {

    @ViewChild('dt') dt!: Table;
    public error!:any;
    listaFormularioExternos: IFormularioExternoSimple[] = [];
    cols: any[] = [];
    loading: boolean = true;
    totalRecords: number = 0;
    rows: number = 30;
    // Variables para ordenamiento
    sortField: string = 'id';
    sortOrder: number = -1;
    searchTerm: string = '';

    constructor(
        public canListarFormularioExterno:CanListarFormularioExternoGuard,
        public canVerFormularioExterno:CanVerFormularioExternoGuard,
        public canCrearFormularioExterno:CanCrearFormularioExternoGuard,
        public canEditarFormularioExterno:CanEditarFormularioExternoGuard,
        public canEliminarFormularioExterno:CanEliminarOperatorGuard,
        public canAnularFormularioExterno:CanAnularFormularioExternoGuard,
        public canImprimirFormularioExterno:CanImprimirFormularioExternoGuard,
        public pdfFormularioExterno:PdfFormularioExternoService,
        private confirmationService:ConfirmationService,
        private notify:ToastrService,
        private formExtService: FormularioExternosService,
        private dialogService: DialogService,
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
        this.formExtService.getFormReducidoOptimizado(
          this.dt?.first / this.rows + 1 || 1,
          this.rows,
          this.searchTerm,
          this.sortField,
          this.sortOrder
        ).subscribe({
          next: (response) => {
            this.listaFormularioExternos = response.data;
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

    generarPDF(formulario_interno:IFormularioExternoSimple){
            this.formExtService.verFormularioExternoPDF(formulario_interno.id.toString()).subscribe(
                        (data:any)=>{
                        let tdm_completo:IFormularioExternoPDF=this.formExtService.handleFormularioExternoPDF(data);

                        this.pdfFormularioExterno.generarPDF(tdm_completo);
                      },
                      (error:any)=> this.error=this.formExtService.handleError(error));
        }
    confirmarEmision(event:IFormularioExternoSimple) {

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Emitir el formulario '+event.nro_formulario+'?',
            accept: () => {
                this.emitir(event); // Llama a onSubmit cuando el usuario acepta
                },
        });
    }
    emitir(event:IFormularioExternoSimple){
            let emitido:any=null;
            this.formExtService.emitirFormularioExterno(event.id).subscribe(
                (data:any)=>{
                    let formulario_emitido:IFormularioExterno
                    formulario_emitido=data.form;
                    if(formulario_emitido!=null)
                    {
                        let index = this.listaFormularioExternos.findIndex(i => i.id === formulario_emitido.id);
                        if (index !== -1) {
                            this.listaFormularioExternos[index].estado = formulario_emitido.estado; // Actualizamos el valor
                            this.listaFormularioExternos[index].fecha_creacion=formulario_emitido.fecha_creacion;
                            this.listaFormularioExternos[index].fecha_vencimiento=formulario_emitido.fecha_vencimiento;
                            this.listaFormularioExternos[index].nro_formulario=formulario_emitido.nro_formulario;
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
