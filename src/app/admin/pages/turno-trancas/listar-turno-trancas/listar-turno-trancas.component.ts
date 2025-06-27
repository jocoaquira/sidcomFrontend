import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITurnoTrancaLista } from '@data/turno_tranca.metadata';
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
  loading = true;
  error = '';
  trancasUnicas: { id: number, nombre: string }[] = [];

  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  semanasAMostrar = 4;

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
    const inicioDia = new Date(dia);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(dia);
    finDia.setHours(23, 59, 59, 999);

    return this.turnos.filter(t =>
      t.trancaId === trancaId &&
      new Date(t.fecha_inicio) <= finDia &&
      new Date(t.fecha_fin) >= inicioDia
    );
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
}
