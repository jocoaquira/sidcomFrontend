import * as XLSX from 'xlsx';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';

import { IOperatorSimple } from '@data/operador_simple.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ChoferService } from 'src/app/admin/services/chofer.service';
import { IChofer } from '@data/chofer.metadata';
import { IChoferAdmin } from '@data/chofer_admin.metadata';
import { ReportesService } from 'src/app/admin/services/reportes.service';
import { IFormularioControlTranca } from '@data/reports/formulario_control_puesto.metadata';



@Component({
    templateUrl: './listar-formularios.component.html',
    providers: [MessageService]
})
export class ListarFormulariosComponent implements OnInit {

    public listaFormulariosControlTranca!:IFormularioControlTranca[];


    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre:string='fd';
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public responsable:IChofer={
        id: null,
        nombre_apellidos: null,
        nro_licencia:null,
        celular:null,
        fecha_vencimiento:null,
        categoria:null,
        fecha_nacimiento:null,
        operador_id:null,
        estado:null,
    };
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private formulariosControlTranca:ReportesService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
    ) {

        this.operador_id=0

    }

    ngOnInit() {
        this.formulariosControlTranca.listarFormulariosControlTrancaReporte('2025-01-01','2025-09-30',348).subscribe(
            (data:any)=>{
                console.log(data);
            this.listaFormulariosControlTranca=this.formulariosControlTranca.handleFormulariosControlTrancaReporte(data);
          },
          (error:any)=> this.error=this.formulariosControlTranca.handleError(error));

        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
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
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.listaFormulariosControlTranca.length; i++) {
            if (this.listaFormulariosControlTranca[i].nro_formulario === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportarAExcel(jsonData: any[], fileName: string): void {
    // Crear hoja de trabajo
    const flattenedData = this.flattenData(jsonData);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedData);

    // Crear libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    // Generar archivo Excel
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
private flattenData(data: any[]): any[] {
    return data.map(item => {
      const flatItem: any = {};
      this.flattenObject(item, flatItem);
      return flatItem;
    });
  }
 private flattenObject(obj: any, result: any, prefix: string = ''): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          this.flattenObject(obj[key], result, newKey);
        } else {
          result[newKey] = obj[key];
        }
      }
    }
  }

  guardar(){
    this.exportarAExcel(this.listaFormulariosControlTranca,'formularios_control_tranca');
  }
}
