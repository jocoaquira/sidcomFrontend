import * as XLSX from 'xlsx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AuthService } from '@core/authentication/services/auth.service';
import { ReportesService } from 'src/app/admin/services/reportes.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { IOperator } from 'src/app/admin/data/operator.metadata';

@Component({
    templateUrl: './reporte-consolidado-form101-externo.component.html'
})
export class ReporteConsolidadoForm101ExternoComponent implements OnInit {

    @ViewChild('dt') dt!: Table;
    public listaFormularios: any[] = [];
    public fecha_inicio: string = '';
    public fecha_fin: string = '';
    public cols: any[] = [];
    public globalFilterFields: string[] = [];
    public operador: IOperator | null = null;
    public idom: string = '';

    constructor(
        private reportesService: ReportesService,
        private authService: AuthService,
        private operatorsService: OperatorsService
    ) {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        this.fecha_fin = `${yyyy}-${mm}-${dd}`;
        this.fecha_inicio = `${yyyy}-${mm}-01`;
    }

    ngOnInit() {
        this.cols = [
            { field: 'nro', header: 'N°' },
            { field: 'lote', header: 'N° LOTE' },
            { field: 'municipio_origen', header: 'MUNICIPIO' },
            { field: 'departamento_origen', header: 'DEPARTAMENTO' },
            { field: 'nro_formulario', header: 'N° DE FORM. 101' },
            { field: 'fecha_emision', header: 'FECHA DE EMISIÓN FORM. 101' },
            { field: 'comprador', header: 'RAZÓN SOCIAL COMPRADOR' },
            { field: 'peso_neto', header: 'PESO NETO [Kg]' }
        ];
        this.globalFilterFields = this.cols.map(c => c.field);

        const operadorId = this.authService.getUser?.operador_id;
        if (operadorId) {
            this.operatorsService.verOperator(String(operadorId)).subscribe((data: any) => {
                this.operador = this.operatorsService.handleOperador(data);
            });
        }

        this.buscar();
    }

    buscar() {
        this.reportesService.listarFormulariosExternoReporte(this.fecha_inicio, this.fecha_fin).subscribe(
            (data: any) => {
                const reporte = this.reportesService.handleListarFormulariosExternoReporte(data);
                const rows = reporte.map((item: any) => {
                    const minerales = Array.isArray(item.minerales) ? item.minerales : [];
                    const municipio_origen = Array.isArray(item.municipio_origen) ? item.municipio_origen : [];
                    const municipios = municipio_origen.map((m: any) => m.municipio_origen).filter(Boolean).join(', ');
                    const departamentos = municipio_origen.map((m: any) => m.departamento).filter(Boolean).join(', ');
                    if (!this.idom && item.IDOM) {
                        this.idom = item.IDOM;
                    }
                    return {
                        ...item,
                        lote: item.lote ?? '',
                        municipio_origen: municipios,
                        departamento_origen: departamentos,
                        nro_formulario: item.nro_formulario ?? '',
                        fecha_emision: this.formatDate(item.fecha_emision),
                        fecha_emision_raw: item.fecha_emision,
                        comprador: item.comprador ?? '',
                        peso_neto: item.peso_neto ?? ''
                    };
                });
                const sorted = rows.sort((a: any, b: any) => {
                    const loteA = (a.lote ?? '').toString();
                    const loteB = (b.lote ?? '').toString();
                    if (loteA !== loteB) return loteA.localeCompare(loteB);
                    const dateA = a.fecha_emision_raw ? new Date(a.fecha_emision_raw).getTime() : 0;
                    const dateB = b.fecha_emision_raw ? new Date(b.fecha_emision_raw).getTime() : 0;
                    return dateA - dateB;
                });
                let currentLote: string | null = null;
                let groupIndex = 0;
                this.listaFormularios = sorted.map((row: any) => {
                    const loteActual = (row.lote ?? '').toString();
                    const isNewGroup = loteActual !== currentLote;
                    if (isNewGroup) {
                        groupIndex += 1;
                        currentLote = loteActual;
                    }
                    return {
                        ...row,
                        nro: isNewGroup ? groupIndex : ''
                    };
                });
            },
            () => {
                this.listaFormularios = [];
            }
        );
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportarCSV() {
        const dataToExport = (this.dt && this.dt.filteredValue && this.dt.filteredValue.length > 0)
            ? this.dt.filteredValue
            : this.listaFormularios;

        const filas: any[][] = [];
        const emptyRow = new Array(11).fill('');

        filas.push([...emptyRow]);
        filas.push(['CONSOLIDADO DE FORMULARIOS 101 COMERCIO EXTERNO', '', '', '', '', '', '', '', '', '', '']);
        filas.push([this.getMesTitulo(), '', '', '', '', '', '', '', '', '', '']);
        filas.push([...emptyRow]);

        filas.push([
            'RAZÓN SOCIAL:', '', this.operador?.razon_social ?? '', '', '',
            'IDOM:', this.idom ?? '', '', '', '', ''
        ]);
        filas.push([
            'PERIODO FISCAL MINERO:', '', this.getPeriodoFiscal(), '', '',
            'DIRECCIÓN DEL DOMICILIO FISCAL:', this.operador?.dl_direccion ?? '', '', '', '', ''
        ]);
        filas.push([
            'NIT:', '', this.operador?.nit ?? '', '', '',
            'NÚMERO TELEFÓNICO/CELULAR:', this.getTelefonos(), '', '', '', ''
        ]);
        filas.push([
            'NIM y/o NIAR:', '', this.operador?.nro_nim ?? '', '', '',
            'CORREO ELECTRÓNICO:', this.operador?.correo_inst ?? '', '', '', ''
        ]);
        filas.push([
            'REPRESENTANTE LEGAL:', '', this.operador?.rep_nombre_completo ?? '', '', '', '', '', '', '', ''
        ]);
        filas.push([...emptyRow]);

        filas.push([
            'N°', 'N° LOTE', 'ORIGEN DEL MINERAL', '', 'N° DE FORM. 101',
            'FECHA DE EMISIÓN FORM. 101', 'RAZÓN SOCIAL COMPRADOR', 'PESO NETO [Kg]', '', '', ''
        ]);
        filas.push(['', '', 'MUNICIPIO', 'DEPARTAMENTO', '', '', '', '', '', '', '']);

        dataToExport.forEach((row: any) => {
            filas.push([
                row.nro ?? '',
                row.lote ?? '',
                row.municipio_origen ?? '',
                row.departamento_origen ?? '',
                row.nro_formulario ?? '',
                row.fecha_emision ?? '',
                row.comprador ?? '',
                row.peso_neto ?? '',
                '', '', ''
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(filas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Consolidado');
        (XLSX as any).writeFile(wb, 'ConsolidadoComercioExterno.csv', { bookType: 'csv', FS: ';' });
    }

    private formatDate(value: any): string {
        if (!value) return '';
        const date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    private getMesTitulo(): string {
        const date = this.parseInputDate(this.fecha_inicio);
        if (!date) return 'MES DE';
        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];
        return `MES DE ${meses[date.getMonth()]} ${date.getFullYear()}`;
    }

    private getPeriodoFiscal(): string {
        const inicio = this.formatDate(this.fecha_inicio);
        const fin = this.formatDate(this.fecha_fin);
        if (!inicio && !fin) return '';
        if (inicio && fin) return `${inicio} A ${fin}`;
        return inicio || fin;
    }

    private getTelefonos(): string {
        if (!this.operador) return '';
        const partes = [this.operador.tel_fijo, this.operador.celular, this.operador.rep_celular]
            .filter(val => val !== null && val !== undefined && String(val).trim() !== '')
            .map(val => String(val));
        return partes.join(' ');
    }

    private parseInputDate(value: string): Date | null {
        if (!value) return null;
        const date = new Date(value);
        if (!isNaN(date.getTime())) return date;
        const parts = value.split('-');
        if (parts.length === 3) {
            const yyyy = Number(parts[0]);
            const mm = Number(parts[1]);
            const dd = Number(parts[2]);
            if (yyyy && mm && dd) return new Date(yyyy, mm - 1, dd);
        }
        return null;
    }
}

