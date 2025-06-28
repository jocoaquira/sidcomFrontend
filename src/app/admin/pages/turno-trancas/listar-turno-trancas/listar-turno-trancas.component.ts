import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITurnoTranca, ITurnoTrancaLista } from '@data/turno_tranca.metadata';
import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { MessageService } from 'primeng/api';
import { TrancaService } from 'src/app/admin/services/tranca.service';
import { ITranca } from '@data/tranca.metadata';

@Component({
  selector: 'app-listar-turno-trancas',
  templateUrl: './listar-turno-trancas.component.html',
  styleUrls: ['./listar-turno-trancas.component.scss'],
  providers: [DatePipe, MessageService]
})
export class ListarTurnoTrancaComponent implements OnInit {
  turnos: ITurnoTrancaLista[] = [];
  trancas: ITranca[] = [];
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
    private trancaService: TrancaService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fecha_de_inicio = new Date();
    this.fecha_de_fin.setDate(this.fecha_de_fin.getDate() + 14);
    this.cargarTurnos();
  }
  cargarTrancas(): void {
    this.trancaService.verTrancas('').subscribe({
      next: (response: any) => {
        this.trancasUnicas = response.map((tranca: any) => ({
          id: tranca.id,
          nombre: tranca.nombre
        }));
      },
      error: (err) => {
        this.error = 'Error al cargar las trancas';
        console.error(err);
      }
    });
  }


  cargarTurnos(): void {
    this.loading = true;
    this.turnoTrancaService.verTurnoTrancas('').subscribe({
      next: (response: any) => {
        this.turnos = this.turnoTrancaService.handleTurnoTranca(response);
        //this.prepararDatos();
        this.cargarTrancas();
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
    console.log( this.trancasUnicas);
  }

  generarCalendario(): void {
    this.semanas = [];

    let currentDate = new Date(this.fecha_de_inicio);
    while (currentDate <= this.fecha_de_fin) {
      this.semanas.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log('semanas_ ',this.semanas);
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
    if(this.fecha_de_inicio > this.fecha_de_fin){
        let nuevaFechaFin = new Date(this.fecha_de_inicio);
        nuevaFechaFin.setDate(nuevaFechaFin.getDate() + 14);
        this.fecha_de_fin = nuevaFechaFin;
    }
    this.cargarTurnos();
  }
}
