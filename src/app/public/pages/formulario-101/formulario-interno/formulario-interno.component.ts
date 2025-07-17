import { Component, OnInit, ViewChild } from '@angular/core';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { CanCrearFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-crear-formulario-interno.guard';
import { CanEditarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-editar-formulario-interno.guard';
import { CanListarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-listar-formulario-interno.guard';
import { CanVerFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-ver-formulario-interno.guard';
import { CanEliminarOperatorGuard } from 'src/app/admin/guards/operators/can-eliminar-operator.guard';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';
import { Table } from 'primeng/table';
import { PdfFormularioInternoService } from 'src/app/admin/services/pdf/formulario-interno-pdf.service';
import { ToastrService } from 'ngx-toastr';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '@core/authentication/services/auth.service';
import { IFormularioInternoPDF } from '@data/formulario_interno_pdf.metadata';
import { DialogService } from 'primeng/dynamicdialog';
import { TrancaDetailComponent } from '../components/control-tranca-detalle.component';

@Component({
  selector: 'app-formulario-interno',
  templateUrl: './formulario-interno.component.html',
  styleUrls: ['./formulario-interno.component.scss']
})
export class FormularioInternoComponent implements OnInit {


    public listaFormularioInternos!:IFormularioInternoSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    cols: any[] = [];
    public statuses!:any;
    public productDialog=false;
    public submitted = true;
    public operador_id:number=null;
    //--------------para la optimizacion------------------------------------
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
        public canEliminarFormularioInterno:CanEliminarOperatorGuard,
        public formularioInternoService:FormularioInternosService,
        public pdfFormularioInterno:PdfFormularioInternoService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
        private authService:AuthService,
        private dialogService: DialogService,
    ) {
        this.operador_id= authService.getUser.operador_id;
     }

    ngOnInit() {

        this.loadData();
        this.cols = [
            { field: 'nro_formulario', header: 'Número' },
            { field: 'razon_social', header: 'Operador' },
            { field: 'fecha_creacion', header: 'Fecha Creación' },
            { field: 'estado', header: 'Estado' },
            { field: 'fecha_vencimiento', header: 'Vencimiento' }
        ];

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
        for (let i = 0; i < this.listaFormularioInternos.length; i++) {
            if (this.listaFormularioInternos[i].nro_formulario === id) {
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

        this.formularioInternoService.verFormularioInternoPDF(formulario_interno.id.toString()).subscribe(
            (data:any)=>{
            let tdm_completo:IFormularioInternoPDF=this.formularioInternoService.handleFormularioInternoPDF(data);
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
    vigenteAnulacion(form:any): boolean {

        const fecha_vencimiento:Date = new Date(form.fecha_vencimiento);
        const fechaLimite = new Date();
        let sw:boolean=fechaLimite <= fecha_vencimiento;

        return sw; // Se muestra solo después de DIAS_ANULACION días
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
