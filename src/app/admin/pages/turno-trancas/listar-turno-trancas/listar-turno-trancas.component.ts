import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITurnoTranca, ITurnoTrancaLista } from '@data/turno_tranca.metadata';
import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-listar-turno-trancas',
  templateUrl: './listar-turno-trancas.component.html',
  styleUrls: ['./listar-turno-trancas.component.scss'],
  providers: [DatePipe, MessageService]
})
export class ListarTurnoTrancaComponent implements OnInit {
  turnos: ITurnoTrancaLista[] = [];
  semanas: Date[] = [];
  fecha_de_inicio: Date = new Date();
  fecha_de_fin: Date = new Date();
  loading = true;
  error = '';
  trancasUnicas: { id: number, nombre: string }[] = [];

  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  semanasAMostrar = 5;

  private coloresUsuarios = new Map<string, string>();

  constructor(
    private turnoTrancaService: TurnoTrancaService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.loading = true;
    this.turnoTrancaService.verTurnoTrancas('').subscribe({
      next: (response: any) => {
        this.turnos = this.turnoTrancaService.handleTurnoTranca(response);
        this.prepararDatos();
        this.generarCalendario();
        this.loading = false;
        console.log(this.turnos)
      },
      error: (err) => {
        this.error = 'Error al cargar los turnos';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los turnos'
        });
        console.error(err);
      }
    });
  }

  prepararDatos(): void {
    const trancasMap = new Map<number, string>();
    this.turnos.forEach(turno => {
      if (turno.nombre_tranca && !trancasMap.has(turno.trancaId)) {
        trancasMap.set(turno.trancaId, turno.nombre_tranca);
      }
    });
    console.log(trancasMap);
    this.trancasUnicas = Array.from(trancasMap.entries()).map(([id, nombre]) => ({ id, nombre }));
  }

  generarCalendario(): void {
    this.semanas = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaFin = new Date(hoy);
    fechaFin.setDate(hoy.getDate() + (this.semanasAMostrar * 7) - 1);

    let currentDate = new Date(hoy);
    while (currentDate <= fechaFin) {
      this.semanas.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  obtenerTurnosDia(trancaId: number, dia: Date): ITurnoTrancaLista[] {
    const dia_actual = new Date(dia);
    dia_actual.setHours(0, 0, 0, 0);

    let turnos_dia= this.turnos.filter(t =>
      t.trancaId === trancaId &&
      new Date(t.fecha_inicio) <= dia_actual &&
      new Date(t.fecha_fin) >= dia_actual
    );
    return turnos_dia;

  }

  esFinDeSemana(dia: Date): boolean {
    return dia.getDay() === 0 || dia.getDay() === 6;
  }

  formatearNombre(nombre: string): string {
    return nombre.toLowerCase()
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  contarDiasMes(dias: Date[], mes: number): number {
    return dias.filter(d => d.getMonth() === mes).length;
  }

  obtenerColor(nombre: string): string {
    if (!this.coloresUsuarios.has(nombre)) {
      this.coloresUsuarios.set(nombre, this.generarColorAleatorio());
    }
    return this.coloresUsuarios.get(nombre)!;
  }

  generarColorAleatorio(): string {
    const hue = Math.floor(Math.random() * 360);
    const pastel = `hsl(${hue}, 70%, 85%)`; // tono claro
    return pastel;
  }
  verDiaUsuario(turno:ITurnoTranca){
    console.log(turno);
  }
  cambioFecha(event){
    console.log(event);
    console.log(this.fecha_de_inicio);
  }
}
