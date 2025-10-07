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

    public listaFormulariosControlTranca!:any[];


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

            this.listaFormulariosControlTranca=this.formulariosControlTranca.handleFormulariosControlTrancaReporte(data);
            this.listaFormulariosControlTranca = this.listaFormulariosControlTranca.map(item => ({
                ...item,
                minerales: item.minerales.map(m => m.mineral).join(', '),
                municipio_origen: item.municipio_origen.map(m => m.municipio_origen).join(', '),
                municipio_destino: item.municipio_destino && item.municipio_destino.length > 0
                    ? item.municipio_destino.map(m => m.municipio_destino).join(', ')
                    : '',
                fecha_control: item.formulario_tranca && item.formulario_tranca.length > 0
                    ? item.formulario_tranca[0].fecha_control
                    : '',
                hora_control: item.formulario_tranca && item.formulario_tranca.length > 0
                    ? item.formulario_tranca[0].hora_control
                    : '',
                tranca: item.formulario_tranca && item.formulario_tranca.length > 0
                    ? item.formulario_tranca[0].tranca
                    : '',
            }));
            console.log(this.listaFormulariosControlTranca);
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
    // Define el mapeo de campos y encabezados
    const columnas = [
        { key: 'hora_control', header: 'Hora' },
        { key: 'fecha_control', header: 'Fecha' },
        { key: 'placa', header: 'Placa' },
        { key: 'conductor', header: 'Nombre del Conductor' },
        { key: 'licencia', header: 'Lic. o Doc.' },
        { key: 'tranca', header: 'Punto de Control' },
        { key: 'razon_social', header: 'Empresa' },
        { key: 'minerales', header: 'Mineral' },
        { key: 'peso_neto', header: 'Peso Neto' },
        { key: 'municipio_origen', header: 'Proc. DEPTO.' },
        { key: 'municipio_origen', header: 'Proc. MUNICIPIO' },
        { key: 'pais_destino', header: 'Dest. PAIS O CIUDAD' },
        { key: 'tipo_formulario', header: 'DESCRIPCION' },
        { key: 'nro_formulario', header: 'N° Form.' },
        { key: 'observaciones', header: 'Observaciones' },

    ];
    // Transforma los datos para usar los encabezados personalizados
    const datosTransformados = jsonData.map(item => {
        const obj: any = {};
        columnas.forEach(col => {
            obj[col.header] = item[col.key];
        });
        return obj;
    });
    // Crear hoja de trabajo con los encabezados personalizados
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosTransformados);
    // Definir el ancho de las columnas (en caracteres)
    ws['!cols'] = [
        { wch: 6 }, // Fecha
        { wch: 9 }, // Hora
        { wch: 8 }, // PLACA
        { wch: 22 }, // Nombre del Conductor
        { wch: 10 }, // Lic. o Doc.
        { wch: 12 }, // Lic. o Doc.
        { wch: 30 }, // Empresa
        { wch: 25 }, // Mineral
        { wch: 8 }, // Peso Neto
        { wch: 12 }, // Proc. dEEPTO.
        { wch: 12 }, // Proc. MUNICIPIO
        { wch: 12 }, // Proc. MUNICIPIO DESTINO
        { wch: 12 }, // PAIS ORIGEN
        { wch: 12 },  // Tipo Formulario
        { wch: 20 }  // Tipo Formulario
    ];

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
