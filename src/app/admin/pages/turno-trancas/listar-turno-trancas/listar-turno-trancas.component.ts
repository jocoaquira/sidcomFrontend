import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITurnoTranca, ITurnoTrancaLista } from '@data/turno_tranca.metadata';
import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { MessageService } from 'primeng/api';
import { TrancaService } from 'src/app/admin/services/tranca.service';
import { ITranca } from '@data/tranca.metadata';

// La interfaz IShiftDisplay ahora es más simple, ya no necesita offsetY
// Asegúrate de que tu interfaz en metadata o donde la definas no tenga 'offsetY'.
interface IShiftDisplay {
  turno: ITurnoTrancaLista;
  startDate: Date;
  endDate: Date;
  span: number; // Número de días que abarca este bloque de turno
  id: string; // ID único para el IShiftDisplay
}

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

  // Esta estructura solo guardará los turnos que INICIAN en un día específico.
  // El apilamiento vertical lo hará CSS.
  processedShifts: { [trancaId: number]: { [dateKey: string]: IShiftDisplay[] } } = {};
  private processedTurnoIds = new Set<string>();

  constructor(
    private turnoTrancaService: TurnoTrancaService,
    private trancaService: TrancaService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fecha_de_inicio = new Date();
    this.fecha_de_fin.setDate(this.fecha_de_fin.getDate() + 14); // Mostrar 15 días por defecto
    this.cargarTurnos();
  }

  cargarTrancas(): void {
    this.trancaService.verTrancas('').subscribe({
      next: (response: any) => {
        this.trancasUnicas = response.map((tranca: any) => ({
          id: tranca.id,
          nombre: tranca.nombre
        }));
        this.processTurnosForDisplay();
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
        this.cargarTrancas();
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

  generarCalendario(): void {
    this.semanas = [];
    let currentDate = new Date(this.fecha_de_inicio);
    while (currentDate <= this.fecha_de_fin) {
      this.semanas.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);

    }
  }

  // Lógica para agrupar turnos consecutivos y calcular su 'span' de días.
  // NO ASIGNA 'offsetY'.
  processTurnosForDisplay(): void {
    this.processedShifts = {};
    this.processedTurnoIds.clear();

    this.trancasUnicas.forEach(tranca => {
      this.processedShifts[tranca.id] = {};
    });

    // 1. Agrupar turnos por usuario y tranca para identificar bloques consecutivos
    const groupedShiftsByUserAndTranca = new Map<string, ITurnoTrancaLista[]>(); // Key: 'trancaId-usuarioId'
    this.turnos.forEach(turno => {
      const key = `${turno.trancaId}-${turno.usuarioId}`;
      if (!groupedShiftsByUserAndTranca.has(key)) {
        groupedShiftsByUserAndTranca.set(key, []);
      }
      groupedShiftsByUserAndTranca.get(key)!.push(turno);
    });

    // 2. Identificar bloques consecutivos y convertirlos a IShiftDisplay
    const shiftBlocks: IShiftDisplay[] = [];
    groupedShiftsByUserAndTranca.forEach(shifts => {
      shifts.sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());

      let currentBlock: ITurnoTrancaLista[] = [];

      shifts.forEach((turno, index) => {
        if (currentBlock.length === 0) {
          currentBlock.push(turno);
        } else {
          const lastTurnoInBlock = currentBlock[currentBlock.length - 1];
          const lastTurnoEndDate = new Date(lastTurnoInBlock.fecha_fin);
          const currentTurnoStartDate = new Date(turno.fecha_inicio);

          lastTurnoEndDate.setDate(lastTurnoEndDate.getDate() + 1); // Avanzar un día para chequear continuidad
          if (lastTurnoEndDate.toDateString() === currentTurnoStartDate.toDateString() &&
            lastTurnoInBlock.trancaId === turno.trancaId &&
            lastTurnoInBlock.usuarioId === turno.usuarioId) {
            currentBlock.push(turno);
          } else {
            this.createShiftDisplayFromBlock(currentBlock, shiftBlocks);
            currentBlock = [turno]; // Iniciar un nuevo bloque
          }
        }

        if (index === shifts.length - 1) {
          this.createShiftDisplayFromBlock(currentBlock, shiftBlocks);
        }
      });
    });

    // 3. Llenar processedShifts solo en el día de inicio del bloque
    shiftBlocks.forEach(shift => {
      const trancaId = shift.turno.trancaId;
      const dateKey = this.datePipe.transform(shift.startDate, 'yyyy-MM-dd')!;

      if (!this.processedShifts[trancaId]) { // Asegurar que el objeto tranca exista
        this.processedShifts[trancaId] = {};
      }
      if (!this.processedShifts[trancaId][dateKey]) {
        this.processedShifts[trancaId][dateKey] = [];
      }
      this.processedShifts[trancaId][dateKey].push(shift);
    });

    // Opcional: ordenar los turnos dentro de cada día para consistencia visual (e.g., por hora de inicio)
    this.trancasUnicas.forEach(tranca => {
      for (const dateKey in this.processedShifts[tranca.id]) {
        this.processedShifts[tranca.id][dateKey].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      }
    });
  }

  private createShiftDisplayFromBlock(block: ITurnoTrancaLista[], targetArray: IShiftDisplay[]): void {
    if (block.length === 0) {
      return;
    }
    const blockId = block.map(t => t.id).join('-');
    if (this.processedTurnoIds.has(blockId)) {
      return;
    }
    this.processedTurnoIds.add(blockId);

    const firstTurno = block[0];
    const lastTurno = block[block.length - 1];

    const startDate = new Date(firstTurno.fecha_inicio);
    const endDate = new Date(lastTurno.fecha_fin);

    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const span = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    targetArray.push({
      turno: firstTurno,
      startDate: startDate,
      endDate: endDate,
      span: span,
      id: blockId
    });
  }

  getShiftsForCell(trancaId: number, day: Date): IShiftDisplay[] {
    const dateKey = this.datePipe.transform(day, 'yyyy-MM-dd')!;
    const shiftsForDay = this.processedShifts[trancaId] ? this.processedShifts[trancaId][dateKey] || [] : [];

    // Filtra para asegurarte de que solo los turnos que realmente comienzan en este día se muestren en esta celda
    const uniqueStartingShifts = shiftsForDay.filter(shift =>
      this.datePipe.transform(shift.startDate, 'yyyy-MM-dd') === dateKey
    );

    return uniqueStartingShifts;
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
    const pastel = `hsl(${hue}, 70%, 85%)`;
    return pastel;
  }

  verDiaUsuario(turno: ITurnoTranca) {

  }

  cambioFecha(event: any): void {
    if (this.fecha_de_inicio > this.fecha_de_fin) {
      let nuevaFechaFin = new Date(this.fecha_de_inicio);
      nuevaFechaFin.setDate(nuevaFechaFin.getDate() + 14);
      this.fecha_de_fin = nuevaFechaFin;
    }
    this.cargarTurnos();
  }







}
