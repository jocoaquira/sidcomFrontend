import * as XLSX from 'xlsx';
import { Component, OnInit, ViewChild } from '@angular/core';
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
    templateUrl: './listar-formularios-internos.component.html',
    providers: [MessageService]
})
export class ListarFormulariosInternosComponent implements OnInit {

    @ViewChild('dt') dt!: Table;
    public listaFormulariosInternos!:any[];
    public fecha_inicio:string='2025-01-01';
    public fecha_fin:string='2025-05-30';
    public user_id:any;

    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre:string='fd';
    public buscarTexto:string='';
    public cols!:any;
    public globalFilterFields: string[] = [];
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public responsable:IChofer={
        id: null,
        nombre_apellidos: null,
        nro_licencia:null,
        operador_id:null,
        estado:null,
    };
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private formulariosInternosReportesService:ReportesService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
    ) {

        this.operador_id=0
        this.user_id=this.authService.getUser.id;
        console.log(this.user_id);
    }

    ngOnInit() {

        this.buscar();
        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'nro', header: 'Nro.' },
            { field: 'operador_minero', header: 'Operador Minero' },
            { field: 'numero_formulario', header: 'Numero de Formulario' },
            { field: 'actor_minero', header: 'Actor Minero' },
            { field: 'tipo_comercio', header: 'Tipo de Comercio' },
            { field: 'fecha_emision', header: 'Fecha de Emisión' },
            { field: 'fecha_vencimiento', header: 'Fecha de Vencimiento' },
            { field: 'estado', header: 'Estado' },
            { field: 'idom', header: 'IDOM' },
            { field: 'nit', header: 'NIT' },
            { field: 'nim_niar', header: 'NIM/NIAR' },
            { field: 'lote', header: 'Lote' },
            { field: 'presentacion', header: 'Presentación' },
            { field: 'cantidad', header: 'Cantidad' },
            { field: 'peso_bruto', header: 'Peso Bruto (kg)' },
            { field: 'tara', header: 'Tara (kg)' },
            { field: 'humedad', header: 'Humedad (%)' },
            { field: 'merma', header: 'Merma (%)' },
            { field: 'peso_neto', header: 'Peso Neto (kg)' },
            { field: 'mineral_metal', header: 'Mineral y/o Metal' },
            { field: 'ley', header: 'Ley' },
            { field: 'municipio_productor', header: 'Municipio Productor' },
            { field: 'codigo_municipio', header: 'Código de Municipio' },
            { field: 'comprador', header: 'Comprador' },
            { field: 'planta_tratamiento', header: 'Planta Tratamiento' },
            { field: 'destino_final', header: 'Destino Final (Municipio)' },
            { field: 'tipo_transporte', header: 'Tipo de Transporte' },
            { field: 'tara_volqueta', header: 'Tara(volqueta)' },
            { field: 'placa', header: 'Placa' },
            { field: 'color', header: 'Color' },
            { field: 'conductor', header: 'Nombre del Conductor' },
            { field: 'licencia', header: 'Licencia de conducir' },
            { field: 'empresa_transportadora', header: 'Empresa Transportadora' },
            { field: 'nro_vagon', header: 'N° Vagon' },
            { field: 'fecha_salida', header: 'Fecha de Salida' },
            { field: 'hora_salida', header: 'Hora de Salida' },
            { field: 'observaciones', header: 'Observaciones' },
            { field: 'solicitud_modificacion', header: 'Solicitud de Modificación' },
            { field: 'solicitud_anulacion', header: 'Solicitud de Anulación' },
            { field: 'representante_legal', header: 'Nombre Representante Legal' },
            { field: 'ci_representante_legal', header: 'Ci Representante Legal' },
            { field: 'ley_reducida', header: 'Ley reducida' },
            { field: 'tipo_traslado_mineral', header: 'Tipo traslado mineral' },
            { field: 'nro_viajes', header: 'Nro. viajes' }
        ];
        this.globalFilterFields = this.cols.map((c: any) => c.field);

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }
    buscar(){
        console.log(this.fecha_inicio);
        console.log(this.fecha_fin);
        this.formulariosInternosReportesService.listarFormulariosInternoReporte(this.fecha_inicio,this.fecha_fin).subscribe(
            (data:any)=>{
                console.log(data);
            this.listaFormulariosInternos=this.formulariosInternosReportesService.handleListarFormulariosInternoReporte(data);
            this.listaFormulariosInternos = this.listaFormulariosInternos.map((item, index) => {
                const minerales = Array.isArray(item.minerales) ? item.minerales : [];
                const municipio_origen = Array.isArray(item.municipio_origen) ? item.municipio_origen : [];
                const mineral_metal = minerales.map((m: any) => m.mineral).filter(Boolean).join(', ');
                const ley = minerales.map((m: any) => {
                    const sigla = m.sigla ? m.sigla : '';
                    const valorLey = m.ley ? m.ley : '';
                    const unidad = m.unidad ? ` ${m.unidad}` : '';
                    if (sigla && valorLey) return `${sigla}(${valorLey}${unidad})`;
                    if (valorLey) return `${valorLey}${unidad}`.trim();
                    return '';
                }).filter(Boolean).join(', ');
                const municipio_productor = municipio_origen.map((m: any) => m.municipio_origen).filter(Boolean).join(', ');
                const codigo_municipio = municipio_origen.map((m: any) => m.codigo).filter(Boolean).join(', ');
                const destino_final = [item.departamento_destino, item.municipio_destino].filter(Boolean).join('-');

                return {
                    ...item,
                    nro: index + 1,
                    operador_minero: item.razon_social ?? '',
                    numero_formulario: item.nro_formulario ?? '',
                    actor_minero: this.mapActorMinero(item.tipo_operador),
                    tipo_comercio: 'INTERNO',
                    fecha_emision: this.formatUtcToLocalDateTime(item.fecha_emision),
                    fecha_vencimiento: this.formatUtcToLocalDateTime(item.fecha_vencimiento),
                    estado: item.estado ?? '',
                    idom: item.IDOM ?? '',
                    nit: item.nit ?? '',
                    nim_niar: item.nro_nim ?? '',
                    lote: item.lote ?? '',
                    presentacion: item.presentacion ?? '',
                    cantidad: item.cantidad ?? '',
                    peso_bruto: item.peso_bruto_humedo ?? '',
                    tara: item.tara ?? '',
                    humedad: item.humedad ?? '',
                    merma: item.merma ?? '',
                    peso_neto: item.peso_neto ?? '',
                    mineral_metal,
                    ley,
                    municipio_productor,
                    codigo_municipio,
                    comprador: item.comprador ?? '',
                    planta_tratamiento: item.planta_tratamiento ?? '',
                    destino_final,
                    tipo_transporte: item.tipo_transporte ?? '',
                    tara_volqueta: item.tara ?? '',
                    placa: item.placa ?? '',
                    color: '',
                    conductor: item.conductor ?? '',
                    licencia: item.licencia ?? '',
                    empresa_transportadora: item.empresa_ferrea ?? '',
                    nro_vagon: item.nro_vagon ?? '',
                    fecha_salida: this.formatUtcToLocalDateTime(item.fecha_ferrea),
                    hora_salida: this.formatUtcToLocalTime(item.hr_ferrea),
                    observaciones: item.observaciones ?? '',
                    solicitud_modificacion: '',
                    solicitud_anulacion: item.anulacion ?? '',
                    representante_legal: item.representante_legal ?? '',
                    ci_representante_legal: item.ci_representante_legal ?? '',
                    ley_reducida: '',
                    tipo_traslado_mineral: item.tipo_mineral ?? '',
                    nro_viajes: item.nro_viajes ?? ''
                };
            });
            console.log(this.listaFormulariosInternos);
        },
          (error:any)=> this.error=this.formulariosInternosReportesService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }



    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.listaFormulariosInternos.length; i++) {
            if (this.listaFormulariosInternos[i].nro_formulario === id) {
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
    const columnas = this.cols.map((c: any) => ({ key: c.field, header: c.header }));
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
    ws['!cols'] = columnas.map(() => ({ wch: 18 }));

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

  private mapActorMinero(tipo: any): string {
    switch (Number(tipo)) {
      case 1:
        return 'COOPERATIVA';
      case 2:
        return 'EMPRESA ESTATAL';
      case 3:
        return 'EMPRESA PRIVADA';
      default:
        return '';
    }
  }

  private formatUtcToLocalDateTime(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${min} ${dd}/${mm}/${yyyy}`;
  }

  private formatUtcToLocalTime(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${hh}:${min}`;
    }
    // Si ya viene solo hora en formato string, devolver tal cual
    return String(value);
  }

  guardar(){
    const dataToExport = (this.dt && this.dt.filteredValue && this.dt.filteredValue.length > 0)
        ? this.dt.filteredValue
        : this.listaFormulariosInternos;
    this.exportarAExcel(dataToExport,'reporte_comercio_interno');
  }
}



