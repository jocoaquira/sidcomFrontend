import * as XLSX from 'xlsx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';

import { IOperatorSimple } from '@data/operador_simple.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IChofer } from '@data/chofer.metadata';
import { ReportesService } from 'src/app/admin/services/reportes.service';

@Component({
    templateUrl: './listar-formularios-externos.component.html',
    providers: [MessageService]
})
export class ListarFormulariosExternosComponent implements OnInit {

    @ViewChild('dt') dt!: Table;
    public listaFormulariosExternos!:any[];
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
        private formulariosExternosReportesService:ReportesService,
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
            { field: 'id_m03', header: 'ID M-03' },
            { field: 'nro_factura', header: 'N° Factura' },
            { field: 'laboratorio', header: 'Laboratorio' },
            { field: 'codigo_analisis', header: 'Código de Análisis' },
            { field: 'acta_verificacion', header: 'Acta de Verificación' },
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
            { field: 'pais_destino', header: 'País de destino' },
            { field: 'aduana_salida', header: 'Aduana de Salida' },
            { field: 'codigo_aduana', header: 'Código Aduana' },
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
            { field: 'ci_representante_legal', header: 'Ci Representante Legal' }
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
        this.formulariosExternosReportesService.listarFormulariosExternoReporte(this.fecha_inicio,this.fecha_fin).subscribe(
            (data:any)=>{
                console.log(data);
            this.listaFormulariosExternos=this.formulariosExternosReportesService.handleListarFormulariosExternoReporte(data);
            this.listaFormulariosExternos = this.listaFormulariosExternos.map((item, index) => {
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

                return {
                    ...item,
                    nro: index + 1,
                    operador_minero: item.razon_social ?? '',
                    numero_formulario: item.nro_formulario ?? '',
                    actor_minero: this.mapActorMinero(item.tipo_operador),
                    tipo_comercio: 'EXTERNO',
                    fecha_emision: this.formatUtcToLocalDateTime(item.fecha_emision),
                    fecha_vencimiento: this.formatUtcToLocalDateTime(item.fecha_vencimiento),
                    estado: item.estado ?? '',
                    idom: item.IDOM ?? '',
                    nit: item.nit ?? '',
                    nim_niar: item.nro_nim ?? '',
                    id_m03: item.m03 ?? '',
                    nro_factura: item.nro_factura_exportacion ?? '',
                    laboratorio: item.laboratorio ?? '',
                    codigo_analisis: item.codigo_analisis ?? '',
                    acta_verificacion: item.acta_verificacion ?? '',
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
                    pais_destino: item.pais ?? '',
                    aduana_salida: item.aduana ?? '',
                    codigo_aduana: item.codigo_aduana ?? '',
                    tipo_transporte: item.tipo_transporte ?? '',
                    tara_volqueta: item.tara_volqueta ?? '',
                    placa: item.placa ?? '',
                    color: '',
                    conductor: item.conductor ?? '',
                    licencia: item.licencia ?? '',
                    empresa_transportadora: item.empresa_ferrea ?? '',
                    nro_vagon: item.nro_vagon ?? '',
                    fecha_salida: this.formatUtcToLocalDateTime(item.fecha_ferrea),
                    hora_salida: this.formatUtcToLocalTime(item.hr_ferrea),
                    observaciones: item.observacion ?? item.observaciones ?? '',
                    solicitud_modificacion: '',
                    solicitud_anulacion: item.anulacion ?? '',
                    representante_legal: item.representante_legal ?? '',
                    ci_representante_legal: item.ci_representante_legal ?? ''
                };
            });
            console.log(this.listaFormulariosExternos);
        },
          (error:any)=> this.error=this.formulariosExternosReportesService.handleError(error));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

exportarAExcel(jsonData: any[], fileName: string): void {
    const columnas = this.cols.map((c: any) => ({ key: c.field, header: c.header }));
    const datosTransformados = jsonData.map(item => {
        const obj: any = {};
        columnas.forEach(col => {
            obj[col.header] = item[col.key];
        });
        return obj;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosTransformados);
    ws['!cols'] = columnas.map(() => ({ wch: 18 }));

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    XLSX.writeFile(wb, `${fileName}.xlsx`);
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
    return String(value);
  }

  guardar(){
    const dataToExport = (this.dt && this.dt.filteredValue && this.dt.filteredValue.length > 0)
        ? this.dt.filteredValue
        : this.listaFormulariosExternos;
    this.exportarAExcel(dataToExport,'reporte_comercio_externo');
  }
}
