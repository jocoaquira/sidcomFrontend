import * as XLSX from 'xlsx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ReportesService } from 'src/app/admin/services/reportes.service';

@Component({
    templateUrl: './listar-operadores-mineros.component.html',
    providers: [MessageService]
})
export class ListarOperadoresMinerosComponent implements OnInit {

    @ViewChild('dt') dt!: Table;
    public listaOperadores!:any[];
    public user_id:any;

    public error!:any;
    public buscarTexto:string='';
    public cols!:any;
    public globalFilterFields: string[] = [];
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;

    constructor(
        private messageService: MessageService,
        private operadoresReportesService:ReportesService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
    ) {
        this.user_id=this.authService.getUser.id;
    }

    ngOnInit() {

        this.buscar();

        this.cols = [
            { field: 'nro', header: 'Nro.' },
            { field: 'operador_minero', header: 'Operdador Minero' },
            { field: 'numero_idom', header: 'Numero de IDOM' },
            { field: 'fecha_registro', header: 'Fecha de Registro' },
            { field: 'fecha_actualizacion', header: 'Fecha de Actualización' },
            { field: 'fecha_expiracion', header: 'Fecha de Expiración' },
            { field: 'nit', header: 'NIT' },
            { field: 'nim_niar', header: 'NIM/NIAR' },
            { field: 'fecha_exp_nim', header: 'Fecha de Expiracion del MIN' },
            { field: 'actor_minero', header: 'Actor Minero' },
            { field: 'nro_personeria', header: 'N° de Personalidad Juridica' },
            { field: 'tipo_doc_creacion', header: 'Tipo Documento Creación de la Empresa' },
            { field: 'doc_creacion', header: 'Documento Creación de la Empresa' },
            { field: 'nro_matricula_seprec', header: 'N° Matricula de SEPREC' },
            { field: 'fecha_exp_seprec', header: 'Fecha de Expiración de SEPREC' },
            { field: 'actividad_minera', header: 'Actividad Minera' },
            { field: 'actividad_explotacion', header: 'Actividad Minera Explotacion' },
            { field: 'codigo_unico', header: 'N° de Codigo Unico' },
            { field: 'nro_cuadricula', header: 'N° de Cuadricula' },
            { field: 'denominacion_areas', header: 'Denominacion de Áreas' },
            { field: 'municipios', header: 'Municipios' },
            { field: 'direccion_oficina', header: 'Dirección Oficina' },
            { field: 'latitud', header: 'Latitud' },
            { field: 'longitud', header: 'Longitud' },
            { field: 'correo', header: 'Correo Electronico' },
            { field: 'telefono', header: 'Telefono' },
            { field: 'fax', header: 'Fax' },
            { field: 'celular', header: 'Celular' },
            { field: 'rep_nombre', header: 'Nombre del Representante Legal' },
            { field: 'rep_ci', header: 'Ci del Representante Legal' },
            { field: 'rep_celular', header: 'Celular del Representante Legal' },
            { field: 'observaciones', header: 'Observaciones' }
        ];
        this.globalFilterFields = this.cols.map((c: any) => c.field);

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    buscar(){
        this.operadoresReportesService.listarOperadoresReporte().subscribe(
            (data:any)=>{
            this.listaOperadores=this.operadoresReportesService.handleListarOperadoresReporte(data);
            this.listaOperadores = this.listaOperadores.map((item: any, index: number) => {
                const arrendamientos = Array.isArray(item.arrendamientos) ? item.arrendamientos : [];
                const oficinas = Array.isArray(item.oficinas) ? item.oficinas : [];

                const codigo_unico = arrendamientos.map((a: any) => a.codigo_unico).filter(Boolean).join(', ');
                const denominacion_areas = arrendamientos.map((a: any) => a.denominacion_area).filter(Boolean).join(', ');
                const municipiosArr = arrendamientos.map((a: any) => a.municipio_id).filter(Boolean);
                const municipiosOfi = oficinas.map((o: any) => o.municipio_id).filter(Boolean);
                const municipios = [...municipiosArr, ...municipiosOfi].join(', ');

                return {
                    ...item,
                    nro: index + 1,
                    operador_minero: item.razon_social ?? '',
                    numero_idom: item.id ? `SDMMRE-${item.id}` : '',
                    fecha_registro: this.formatUtcToLocalDateTime(item.fecha_creacion),
                    fecha_actualizacion: this.formatUtcToLocalDateTime(item.fecha_actualizacion),
                    fecha_expiracion: this.formatUtcToLocalDateTime(item.fecha_expiracion),
                    nit: item.nit ?? '',
                    nim_niar: this.formatNimNiar(item.nro_nim, item.tipo_nim_niar),
                    fecha_exp_nim: this.formatUtcToLocalDateTime(item.fecha_exp_nim),
                    actor_minero: this.mapActorMinero(item.tipo_operador),
                    nro_personeria: item.nro_personeria ?? '',
                    tipo_doc_creacion: item.tipo_doc_creacion ?? '',
                    doc_creacion: item.doc_creacion ?? '',
                    nro_matricula_seprec: item.nro_matricula_seprec ?? '',
                    fecha_exp_seprec: this.formatUtcToLocalDateTime(item.fecha_exp_seprec),
                    actividad_minera: this.mapActividadMinera(item),
                    actividad_explotacion: item.act_explotacion ? 'SI' : 'NO',
                    codigo_unico,
                    nro_cuadricula: '',
                    denominacion_areas: denominacion_areas || item.denominacion_area || '',
                    municipios,
                    direccion_oficina: item.dl_direccion ?? '',
                    latitud: item.ofi_lat ?? '',
                    longitud: item.ofi_lon ?? '',
                    correo: item.correo_inst ?? '',
                    telefono: item.tel_fijo ?? '',
                    fax: item.fax_op_min ?? '',
                    celular: item.celular ?? '',
                    rep_nombre: item.rep_nombre_completo ?? '',
                    rep_ci: item.rep_ci ?? '',
                    rep_celular: item.rep_celular ?? '',
                    observaciones: item.observaciones ?? ''
                };
            });
        },
          (error:any)=> this.error=this.operadoresReportesService.handleError(error));
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

  private mapActividadMinera(oper: any): string {
    const act: string[] = [];
    if (oper.act_exploracion) act.push('EXPLORACION');
    if (oper.act_explotacion) act.push('EXPLOTACION');
    if (oper.act_comer_interna) act.push('COMERCIO INTERNO');
    if (oper.act_comer_externa) act.push('COMERCIO EXTERNO');
    if (oper.act_ben_concentracion) act.push('BENEFICIO O CONCENTRACION');
    if (oper.act_fundicion) act.push('FUNDICION');
    if (oper.act_industrializacion) act.push('INDUSTRIALIZACION');
    if (oper.act_refinacion) act.push('REFINACION');
    if (oper.act_calcinacion) act.push('CALCINACION');
    if (oper.act_tostacion) act.push('TOSTACION');
    if (oper.act_tras_colas) act.push('TRASLADO COLAS');
    return act.join(', ');
  }

  private formatNimNiar(nro: any, tipo: any): string {
    if (!nro && !tipo) return '';
    if (nro && tipo) return `${nro} (${tipo})`;
    return nro ?? tipo ?? '';
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

  guardar(){
    const dataToExport = (this.dt && this.dt.filteredValue && this.dt.filteredValue.length > 0)
        ? this.dt.filteredValue
        : this.listaOperadores;
    this.exportarAExcel(dataToExport,'reporte_operadores_mineros');
  }
}
