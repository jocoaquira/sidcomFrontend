import { Component, OnInit, ViewChild } from '@angular/core';

import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { CanVerOperadorReducidoFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-ver-operador-reducido-formulario-cola.guard';
import { CanVerFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-ver-formulario-cola.guard';
import { CanEditarFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-editar-formulario-cola.guard';
import { CanEliminarFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-eliminar-formulario-cola.guard';
import { CanAnularFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-anular-formulario-cola.guard';
import { CanImprimirFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-imprimir-formulario-cola.guard';
import { FormularioTrasladoColaService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola.service';
import { IFormularioTrasladoColaSimple } from '@data/formulario_cola_simple.metadata';
import { PdfFormularioTrasladoColaService } from 'src/app/admin/services/pdf/traslado-cola-pdf.service';
import { CanCrearFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-crear-formulario-cola.guard';
import { AuthService } from '@core/authentication/services/auth.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TrancaDetailComponent } from '../components/control-tranca-detalle.component';


@Component({
  selector: 'app-formulario-traslado-cola',
  templateUrl: './formulario-traslado-cola.component.html',
  styleUrls: ['./formulario-traslado-cola.component.scss']
})
export class FormularioTrasladoColaComponent implements OnInit {


    public listaFormularioTrasladoColas!:IFormularioTrasladoColaSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public submitted = true;
    public operador_id:number=0;
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
        public canListarFormularioTrasladoCola:CanVerOperadorReducidoFormularioColasGuard,
        public canVerFormularioTrasladoCola:CanVerFormularioColasGuard,
        public canCrearFormularioTrasladoCola:CanCrearFormularioColasGuard,
        public canEditarFormularioTrasladoCola:CanEditarFormularioColasGuard,
        public canEliminarFormularioTrasladoCola:CanEliminarFormularioColasGuard,
        public canAnularFormularioTrasladoCola:CanAnularFormularioColasGuard,
        public canImprimirFormularioTrasladoCola:CanImprimirFormularioColasGuard,
        public formularioTrasladoColaService:FormularioTrasladoColaService,
        public pdfFormularioTrasladoCola:PdfFormularioTrasladoColaService,
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
        this.formularioTrasladoColaService.getFormReducidoOperadorOptimizado(
          this.dt?.first / this.rows + 1 || 1,
          this.rows,
          this.searchTerm,
          this.sortField,
          this.sortOrder,
          this.operador_id
        ).subscribe({
          next: (response) => {
            this.listaFormularioTrasladoColas = response.data;
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
    generarPDF(tdm:IFormularioTrasladoColaSimple){
                this.formularioTrasladoColaService.verFormularioTrasladoColaPDF(tdm.id.toString()).subscribe(
                    (data:any)=>{
                    let tdm_completo=this.formularioTrasladoColaService.handleFormularioTrasladoColaPDF(data);

                    this.pdfFormularioTrasladoCola.generarPDF(tdm_completo);
                  },
                  (error:any)=> this.error=this.formularioTrasladoColaService.handleError(error));

        }
    emitir(event:IFormularioTrasladoColaSimple){
        let emitido:any=null;
        this.formularioTrasladoColaService.emitirFormularioTrasladoCola(event.id).subscribe(
            (data:any)=>{
                let formulario_emitido:IFormularioTrasladoColaSimple
                formulario_emitido=data.form;
                if(formulario_emitido!=null)
                {
                    let index = this.listaFormularioTrasladoColas.findIndex(i => i.id === formulario_emitido.id);
                    if (index !== -1) {
                        this.listaFormularioTrasladoColas[index].estado = formulario_emitido.estado; // Actualizamos el valor
                        this.listaFormularioTrasladoColas[index].fecha_creacion=formulario_emitido.fecha_creacion;
                        this.listaFormularioTrasladoColas[index].fecha_vencimiento=formulario_emitido.fecha_vencimiento;
                        this.listaFormularioTrasladoColas[index].nro_formulario=formulario_emitido.nro_formulario;
                    }
                    this.notify.success('El el formulario interno '+formulario_emitido.nro_formulario+' se emitió exitosamente','Emitido Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                }
          },
          (error:any) =>
            {
                this.notify.error('Falló...Revise los datos y vuelva a enviar....','Error con la Emisión del Formulario',{timeOut:2000,positionClass: 'toast-top-right'});
            });
    }
    confirmarEmision(event:IFormularioTrasladoColaSimple) {

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


