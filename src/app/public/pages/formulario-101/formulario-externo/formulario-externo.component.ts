import { Component, OnInit } from '@angular/core';
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
        private authService:AuthService,
    ) {
        this.operador_id= authService.getUser.operador_id;
     }

    ngOnInit() {
        this.formularioExternoService.verFormularioExternosOperadorSimple(this.operador_id.toString()).subscribe(
            (data:any)=>{
            this.listaFormularioExternos=this.formularioExternoService.handleFormularioExternoSimple(data);
          },
          (error:any)=> this.error=this.formularioExternoService.handleError(error));


        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

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
        for (let i = 0; i < this.listaFormularioExternos.length; i++) {
            if (this.listaFormularioExternos[i].nro_formulario === id) {
                index = i;
                break;
            }
        }

        return index.toString();
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

}
