import * as XLSX from 'xlsx';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ReportesService } from 'src/app/admin/services/reportes.service';
import { ITomaDeMuestraReporte } from '@data/reports/toma_de_muestra_reporte.metadata';

@Component({
    templateUrl: './listar-toma-de-muestra.component.html',
    providers: [MessageService]
})
export class ListarTomaDeMuestraComponent implements OnInit {
    public listaTomaDeMuestra: any[] = [];
    public fecha_inicio: Date;
    public fecha_fin: Date;
    public error: any;
    public cols: any;

    constructor(
        private reportesService: ReportesService
    ) {
        const today = new Date();
        this.fecha_fin = today;
        this.fecha_inicio = new Date(today.getFullYear(), 0, 1);
    }

    ngOnInit() {
        this.buscar();
        this.cols = [
            { field: 'nro', header: 'N°' },
            { field: 'fecha', header: 'FECHA' },
            { field: 'operador', header: 'OPERADOR MINERO' },
            { field: 'sn', header: 'Sn%' },
            { field: 'pb', header: 'Pb%' },
            { field: 'f_pb', header: 'F. Pb' },
            { field: 'zn', header: 'Zn%' },
            { field: 'f_zn', header: 'F. Zn' },
            { field: 'ag', header: 'Ag. (g/Tn.)' },
            { field: 'f_ag', header: 'F. Ag' },
            { field: 'cu', header: 'Cu%' },
            { field: 'f_cu', header: 'F. Cu' },
            { field: 'sb', header: 'Sb%' },
            { field: 'f_sb', header: 'F. Sb' },
            { field: 'otros', header: 'OTROS' },
            { field: 'mineral', header: 'Mineral' },
            { field: 'ley_mineral', header: 'LEY MINERAL Y/O METAL' },
            { field: 'peso_humedo', header: 'PESO HUMEDO [TN]' },
            { field: 'humedad', header: 'HUMEDAD %' },
            { field: 'peso_seco', header: 'PESO SECO [Tn]' },
            { field: 'lote', header: 'LOTE' },
            { field: 'departamento', header: 'DEPARTAMENTO PRODUCTOR' },
            { field: 'nro_formulario', header: 'N° FORMULARIO' },
            { field: 'camiones', header: 'N° CAMIONES' },
            { field: 'tecnico', header: 'TECNICO' },
            { field: 'hora', header: 'HORA' }
        ];
    }

    buscar() {
        const inicio = this.formatDateForApi(this.fecha_inicio);
        const fin = this.formatDateForApi(this.fecha_fin);
        this.reportesService.listarTomaDeMuestraReporte(inicio, fin).subscribe(
            (data: any) => {
                console.log('Reporte Toma de Muestra (raw):', data);
                const lista = this.reportesService.handleListarTomaDeMuestraReporte(data as ITomaDeMuestraReporte[]);
                this.listaTomaDeMuestra = lista.map((item, index) => this.mapReporteItem(item, index));
            },
            (error: any) => this.error = this.reportesService.handleError(error)
        );
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    guardar() {
        this.exportarAExcel(this.listaTomaDeMuestra, 'reporte_toma_muestras');
    }

    exportarAExcel(jsonData: any[], fileName: string): void {
        const headers = [
            'N°',
            'FECHA',
            'OPERADOR MINERO',
            'Sn%',
            'Pb%',
            'F. Pb',
            'Zn%',
            'F. Zn',
            'Ag. (g/Tn.)',
            'F. Ag',
            'Cu%',
            'F. Cu',
            'Sb%',
            'F. Sb',
            'OTROS',
            'Mineral',
            'LEY MINERAL Y/O METAL',
            'PESO HUMEDO [TN]',
            'HUMEDAD %',
            'PESO SECO [Tn]',
            'LOTE',
            'DEPARTAMENTO PRODUCTOR',
            'N° FORMULARIO',
            'N° CAMIONES',
            'TECNICO',
            'HORA'
        ];

        const dataRows = jsonData.map(item => {
            return [
                item.nro,
                item.fecha,
                item.operador,
                item.sn,
                item.pb,
                '', // F. Pb (fórmula)
                item.zn,
                '', // F. Zn (fórmula)
                item.ag,
                '', // F. Ag (fórmula)
                item.cu,
                '', // F. Cu (fórmula)
                item.sb,
                '', // F. Sb (fórmula)
                item.otros,
                item.mineral,
                item.ley_mineral,
                item.peso_humedo,
                item.humedad,
                '', // PESO SECO (fórmula)
                item.lote,
                item.departamento,
                item.nro_formulario,
                item.camiones,
                item.tecnico,
                item.hora
            ];
        });

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

        const firstDataRow = 2;
        const lastDataRow = dataRows.length + 1;
        for (let r = firstDataRow; r <= lastDataRow; r++) {
            this.setFormula(ws, r, 6, `T${r}*E${r}/100`); // F. Pb
            this.setFormula(ws, r, 8, `T${r}*G${r}/100`); // F. Zn
            this.setFormula(ws, r, 10, `T${r}*I${r}/1000000`); // F. Ag
            this.setFormula(ws, r, 12, `T${r}*K${r}/100`); // F. Cu
            this.setFormula(ws, r, 14, `T${r}*M${r}/100`); // F. Sb
            this.setFormula(ws, r, 20, `R${r}*(1-S${r}/100)`); // PESO SECO
        }

        ws['!cols'] = [
            { wch: 4 },
            { wch: 10 },
            { wch: 30 },
            { wch: 6 },
            { wch: 6 },
            { wch: 8 },
            { wch: 6 },
            { wch: 8 },
            { wch: 10 },
            { wch: 8 },
            { wch: 6 },
            { wch: 8 },
            { wch: 6 },
            { wch: 8 },
            { wch: 18 },
            { wch: 18 },
            { wch: 30 },
            { wch: 14 },
            { wch: 10 },
            { wch: 14 },
            { wch: 14 },
            { wch: 22 },
            { wch: 16 },
            { wch: 12 },
            { wch: 26 },
            { wch: 8 }
        ];

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    }

    private mapReporteItem(item: ITomaDeMuestraReporte, index: number): any {
        const minerales = Array.isArray(item.minerales) ? item.minerales : [];
        const pesoHumedoKg = this.toNumber(item.peso_neto);
        const pesoHumedo = pesoHumedoKg === null ? null : (pesoHumedoKg / 1000);
        const humedadRaw = this.toNumber(item.humedad);
        const humedad = this.normalizeHumedad(humedadRaw);
        const humedadPercent = humedad === null ? null : humedad * 100;
        const pesoSeco = (pesoHumedo !== null && humedad !== null)
            ? pesoHumedo * (1 - humedad)
            : pesoHumedo;

        const sn = this.getLeyBySigla(minerales, 'Sn');
        const pb = this.getLeyBySigla(minerales, 'Pb');
        const zn = this.getLeyBySigla(minerales, 'Zn');
        const ag = this.getLeyBySigla(minerales, 'Ag');
        const cu = this.getLeyBySigla(minerales, 'Cu');
        const sb = this.getLeyBySigla(minerales, 'Sb');

        return {
            nro: index + 1,
            fecha: this.formatFecha(item.fecha_aprobacion),
            operador: item.razon_social,
            sn: this.normalizeNumber(sn?.ley),
            pb: this.normalizeNumber(pb?.ley),
            f_pb: this.roundNumber(this.calcFinoPorcentaje(pesoSeco, pb?.ley), 3),
            zn: this.normalizeNumber(zn?.ley),
            f_zn: this.roundNumber(this.calcFinoPorcentaje(pesoSeco, zn?.ley), 3),
            ag: this.normalizeNumber(ag?.ley),
            f_ag: this.roundNumber(this.calcFinoGramos(pesoSeco, ag?.ley), 4),
            cu: this.normalizeNumber(cu?.ley),
            f_cu: this.roundNumber(this.calcFinoPorcentaje(pesoSeco, cu?.ley), 3),
            sb: this.normalizeNumber(sb?.ley),
            f_sb: this.roundNumber(this.calcFinoPorcentaje(pesoSeco, sb?.ley), 3),
            otros: this.formatOtros(minerales),
            mineral: this.formatMineralesNombre(minerales),
            ley_mineral: this.formatLeyMineral(minerales),
            peso_humedo: this.roundNumber(pesoHumedo, 3),
            humedad: this.roundNumber(humedadPercent, 4),
            peso_seco: this.roundNumber(pesoSeco, 3),
            lote: item.lote,
            departamento: item.departamento,
            nro_formulario: item.nro_formulario,
            camiones: item.camiones,
            tecnico: this.getTecnico(item),
            hora: this.formatHora(item.fecha_aprobacion)
        };
    }

    private getTecnico(item: ITomaDeMuestraReporte): string {
        return item.responsable_gador
            || item.responsable_senarecom
            || item.responsable_muestra
            || '';
    }

    private getLeyBySigla(minerales: any[], sigla: string): any | null {
        const found = minerales.find(m => (m.sigla || '').toUpperCase() === sigla.toUpperCase());
        return found || null;
    }

    private formatMineralesNombre(minerales: any[]): string {
        const nombres = minerales
            .map(m => m.mineral)
            .filter((m: string) => !!m);
        return nombres.join('-');
    }

    private formatLeyMineral(minerales: any[]): string {
        return minerales
            .filter(m => m.sigla && m.ley !== null && m.ley !== undefined)
            .map(m => {
                const unidad = m.unidad ? m.unidad : '';
                return `${m.sigla}(${m.ley}${unidad})`;
            })
            .join(';');
    }

    private formatOtros(minerales: any[]): string {
        const principales = ['SN', 'PB', 'ZN', 'AG', 'CU', 'SB'];
        return minerales
            .filter(m => m.sigla && !principales.includes(String(m.sigla).toUpperCase()))
            .map(m => {
                const unidad = m.unidad ? m.unidad : '';
                if (m.ley !== null && m.ley !== undefined) {
                    return `${m.sigla}=${m.ley}${unidad}`;
                }
                return `${m.sigla}`;
            })
            .join('; ');
    }

    private calcFinoPorcentaje(pesoSeco: number | null, ley: number | null): number | null {
        if (pesoSeco === null || ley === null || ley === undefined) {
            return null;
        }
        return pesoSeco * (ley / 100);
    }

    private calcFinoGramos(pesoSeco: number | null, ley: number | null): number | null {
        if (pesoSeco === null || ley === null || ley === undefined) {
            return null;
        }
        return (pesoSeco * ley) / 1000000;
    }

    private normalizeNumber(value: any): number | null {
        const num = this.toNumber(value);
        return num === null ? null : num;
    }

    private toNumber(value: any): number | null {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const num = Number(value);
        return isNaN(num) ? null : num;
    }

    private roundNumber(value: number | null, decimals: number): number | null {
        if (value === null || value === undefined) {
            return null;
        }
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    private formatFecha(value: string): string {
        if (!value) {
            return '';
        }
        const d = new Date(value);
        return d.toLocaleDateString('es-BO');
    }

    private formatHora(value: string): string {
        if (!value) {
            return '';
        }
        const d = new Date(value);
        return d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
    }

    private formatDateForApi(date: Date): string {
        if (!date) {
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private setFormula(ws: XLSX.WorkSheet, row: number, col: number, formula: string): void {
        const addr = XLSX.utils.encode_cell({ r: row - 1, c: col - 1 });
        if (!ws[addr]) {
            ws[addr] = { t: 'n' };
        }
        ws[addr].f = formula;
    }

    private normalizeHumedad(value: number | null): number | null {
        if (value === null || value === undefined) {
            return null;
        }
        if (value < 0) {
            return null;
        }
        return value / 100;
    }
}
