import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { CanListarFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-listar-formulario-externo.guard';
import { CanVerFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-ver-formulario-externo.guard';
import { CanCrearFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-crear-formulario-externo.guard';
import { CanEditarFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-editar-formulario-externo.guard';
import { CanEliminarOperatorGuard } from 'src/app/admin/guards/operators/can-eliminar-operator.guard';
import { FormularioExternosService } from 'src/app/admin/services/formulario-externo/formulariosexternos.service';
import { IFormularioExternoSimple } from '@data/formulario_externo_simple.metadata';
import { IFormularioExterno } from '@data/formulario_externo.metadata';
import { PdfFormularioExternoService } from 'src/app/admin/services/pdf/formulario-externo-pdf.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { environment } from 'src/environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { TrancaDetailComponent } from '../components/control-tranca-detalle.component';

@Component({
  selector: 'app-formulario-externo',
  templateUrl: './formulario-externo.component.html',
  styleUrls: ['./formulario-externo.component.scss']
})
export class FormularioExternoComponent implements OnInit {


    public listaFormularioExternos!:IFormularioExternoSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public operador_id:number=null;
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public submitted = true;
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
        public canListarFormularioExterno:CanListarFormularioExternoGuard,
        public canVerFormularioExterno:CanVerFormularioExternoGuard,
        public canCrearFormularioExterno:CanCrearFormularioExternoGuard,
        public canEditarFormularioExterno:CanEditarFormularioExternoGuard,
        public canEliminarFormularioExterno:CanEliminarOperatorGuard,
        public formularioExternoService:FormularioExternosService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
        private formularioExternoPDF:PdfFormularioExternoService,
        private dialogService: DialogService,
        private authService:AuthService,
    ) {
        this.operador_id= authService.getUser.operador_id;
     }

    ngOnInit() {

        //this.productService.getProducts().then(data => this.products = data);

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
        this.formularioExternoService.getFormReducidoOperadorOptimizado(
          this.dt?.first / this.rows + 1 || 1,
          this.rows,
          this.searchTerm,
          this.sortField,
          this.sortOrder,
          this.operador_id
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
    generarPDF(tdm:IFormularioExternoSimple){

        this.formularioExternoService.verFormularioExternoPDF(tdm.id.toString()).subscribe(
            (data:any)=>{
            let tdm_completo=this.formularioExternoService.handleFormularioExternoPDF(data);

            this.formularioExternoPDF.generarPDF(tdm_completo);
          },
          (error:any)=> this.error=this.formularioExternoService.handleError(error));

}
    emitir(event:IFormularioExternoSimple){
        let emitido:any=null;
        this.formularioExternoService.emitirFormularioExterno(event.id).subscribe(
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
    confirmarEmision(event:IFormularioExternoSimple) {

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
