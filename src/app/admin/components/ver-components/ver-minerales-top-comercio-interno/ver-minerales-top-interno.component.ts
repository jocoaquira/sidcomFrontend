import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IDepartamento } from '@data/departamento.metadata';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';

interface Mineral {
    id: number;
    nombre: string;
    sigla: string;
    cantidad_formularios: number;
    peso_neto_total: number;
    ley_promedio: number;
    porcentaje_total: number; // Cambiado a number
    ranking: number;
  }

  interface PeriodoReporte {
    nombre: string;
    dato: Mineral[];
  }

  interface Metadata {
    generado_en: string;
    calculo: string;
  }

  interface ApiResponse {
    dia: PeriodoReporte;
    semana: PeriodoReporte;
    mes: PeriodoReporte;
    anio: PeriodoReporte;
    metadata: Metadata;
  }
  interface MineralResponse {
    id: number;
    nombre: string;
    sigla: string;
    cantidad_formularios: number;
    peso_neto_total: number;
    ley_promedio: number;
    porcentaje_total: string | number; // Puede venir como "12.34%" o como número
    ranking: number;
  }

  interface Mineral extends Omit<MineralResponse, 'porcentaje_total'> {
    porcentaje_total: number; // Lo convertimos siempre a número
  }


@Component({
  selector: 'app-ver-minerales-top-interno',
  templateUrl: './ver-minerales-top-interno.component.html',
  styleUrls: ['./ver-minerales-top-interno.component.scss']
})
export class VerMineralesTopInternoComponent implements OnInit {
    //@Input() id!: number;
   // @Output() estadoDialogo = new EventEmitter<boolean>();
    errorMessage = '';
    loading = true;
    minerales: Mineral[] = [];
    periodos = [
        { nombre: 'Día', codigo: 'dia' },
        { nombre: 'Semana', codigo: 'semana' },
        { nombre: 'Mes', codigo: 'mes' },
        { nombre: 'Año', codigo: 'anio' }
    ];
    periodoSeleccionado = this.periodos[2];
    metadata = {
        generado_en: '',
        calculo: ''
    };
    public error: any = null;


  constructor(
    private formInterno:FormularioInternosService,
  ) {}

  ngOnInit() {
    this.cargarDatos(this.periodoSeleccionado.codigo);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  cargarDatos(periodo: string) {
    this.loading = true;

    this.formInterno.verReporteTopMinerales().subscribe({
      next: (response: any) => {
        const periodoData = response[periodo];
        if (periodoData?.dato) {
          this.minerales = periodoData.dato.map((m: MineralResponse) => ({
            ...m,
            porcentaje_total: this.parsearPorcentaje(m.porcentaje_total)
          })) as Mineral[];
        }
      },
      error: (err) => {
        this.error = this.formInterno.handleError(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  private parsearPorcentaje(valor: unknown): number {
    // Caso 1: Ya es número
    if (typeof valor === 'number') {
      return valor;
    }

    // Caso 2: Es string con formato "12.34%"
    if (typeof valor === 'string') {
      const num = parseFloat(valor.replace('%', ''));
      return isNaN(num) ? 0 : num;
    }

    // Caso 3: Cualquier otro tipo (undefined, null, objeto, etc)
    return 0;
  }
  cambiarPeriodo(event: any) {
    this.cargarDatos(event.value.codigo);
  }
  getColor(index: number): string {
    const colors = ['orange', 'cyan', 'pink', 'purple', 'teal'];
    return colors[index % colors.length];
  }

}
