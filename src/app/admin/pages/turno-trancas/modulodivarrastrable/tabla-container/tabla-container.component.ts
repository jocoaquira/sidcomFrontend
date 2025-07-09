import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { Component, OnInit } from '@angular/core';
import { ITranca } from '@data/tranca.metadata';
import { ITurnoTrancaLista } from '@data/turno_tranca.metadata';
import { TrancaService } from 'src/app/admin/services/tranca.service';
import { firstValueFrom } from 'rxjs';

interface IMes{
    nombre: string;
    dias: number;
}

interface ITurnoUsuario{
    fecha_fin: Date;
    fecha_inicio: Date;
    dias: number;
    trancaId: number;
    usuarioId: number;
    posFila: number;
    nombreUsuario: string;
}

@Component({
  selector: 'app-tabla-container',
  templateUrl: './tabla-container.component.html',
  styleUrls: ['./tabla-container.component.scss']
})
export class TablaContainerComponent implements OnInit {
  rows = 5;
  columns = 15;
  columnWidth = 100;
  rowHeight = 60;
  itemWidth = 100;
  itemHeight = 30;
  items: any[] = [];
  itemsTurnos: any[] = [];
  gridCells: any[] = [];
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  turnosDias:any[]=[];
  dragging = false;
  draggedElement: any = null;
  offsetX = 0;
  offsetY = 0;

  turnos: ITurnoTrancaLista[] = [];
  trancas: ITranca[] = [];
  listaTurnosMatriz:ITurnoUsuario[] = [];
  semanas: Date[] = [];
  meses: IMes[] = [];
  encabezados: any[] = [];
  encabezadosTranca: any[] = [];
  fecha_de_inicio: Date = new Date();
  fecha_de_fin: Date = new Date();
  loading = true;
  error=null;

  //-----------------dialogo crear variables------------------------------------------------
  crearDialogo: boolean = false;
  modoEditar: boolean = false;
  posicionCreacion: { top?: number; left?: number } = { top: 0, left: 0 };
  dialogVisible: boolean = false;
  dialogPosition: { x: number; y: number } | null = null;
  cellIndex: number | null = null;
  private resizingElement: any = null;
  private initialMouseX: number = 0;

  constructor(
    private trancaService: TrancaService,
    private turnoTrancaService: TurnoTrancaService,
  ) {
    // Mover la inicialización del grid aquí NO es necesario
    // this.updateGrid();
  }

  async ngOnInit() {
    try {
      this.loading = true;

      // 1. Configurar fechas iniciales ANTES de calcular columnas
      this.configurarFechasIniciales();

      // 2. Cargar datos base necesarios para dimensiones del grid
      await this.cargarDatosBase();

      // 3. Configurar dimensiones del grid basado en datos cargados
      this.configurarDimensionesGrid();

      // 4. Generar el grid con las dimensiones correctas
      this.updateGrid();

      // 5. Cargar y mostrar contenido
      await this.cargarContenidoCompleto();

      this.loading = false;
    } catch (error) {
      this.error = 'Error al inicializar el componente';
      this.loading = false;
      console.error('Error en ngOnInit:', error);
    }
  }

  //-----------------------------------CONFIGURACIÓN INICIAL-----------------------------------
  private configurarFechasIniciales(): void {
    this.fecha_de_inicio = new Date();
    this.fecha_de_inicio.setHours(0, 0, 0, 0);

    this.fecha_de_fin = new Date();
    this.fecha_de_fin.setDate(this.fecha_de_fin.getDate() + 14); // 15 días por defecto
    this.fecha_de_fin.setHours(0, 0, 0, 0);

  }

  private async cargarDatosBase(): Promise<void> {
    try {
      // Cargar trancas primero para determinar filas
      const responseTrancas: any = await firstValueFrom(this.trancaService.verTrancas(''));
      this.trancas = this.trancaService.handleTrancas(responseTrancas);

      // Cargar turnos
      const responseTurnos: any = await firstValueFrom(this.turnoTrancaService.verTurnoTrancas(''));
      this.turnos = this.turnoTrancaService.handleTurnoTranca(responseTurnos);


    } catch (error) {
      console.error('Error cargando datos base:', error);
      throw error;
    }
  }

  private configurarDimensionesGrid(): void {
    // Calcular columnas basado en el rango de fechas
    const diferenciaMilisegundos = this.fecha_de_fin.getTime() - this.fecha_de_inicio.getTime();
    const diasEnRango = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;
    this.columns = diasEnRango + 1; // +1 para la columna de trancas

    // Calcular filas basado en trancas + encabezado
    this.rows = this.trancas.length + 1; // +1 para el encabezado


  }

  private async cargarContenidoCompleto(): Promise<void> {
    try {
      // Cargar en orden secuencial
      await this.cargarEncabezadoCalendario();
      await this.cargarEncabezadoTranca();
      await this.procesarYMostrarTurnos();

    } catch (error) {
      console.error('Error cargando contenido completo:', error);
      throw error;
    }
  }

  private async procesarYMostrarTurnos(): Promise<void> {
    try {
      await this.cargarTurnosMatriz();
      await this.colocarTurnosEnPantalla();
    } catch (error) {
      console.error('Error procesando turnos:', error);
      throw error;
    }
  }

  //-----------------------------------PARA LAS GRILLAS-----------------------------------
  updateGrid(): void {
    this.gridCells = Array(this.rows * this.columns).fill(null);

  }

  generateGridRows(): string {
    return `repeat(${this.rows}, ${this.rowHeight}px)`;
  }

  generateGridColumns(): string {
    return `repeat(${this.columns}, ${this.columnWidth}px)`;
  }

  //---------------------------------CONTROL DE ARRASTRE-----------------------------------
  startDrag(event: MouseEvent, item: any): void {
    this.dragging = true;
    this.draggedElement = item;
    this.offsetX = event.clientX - item.positionX;
    this.offsetY = event.clientY - item.positionY;

    document.addEventListener('mousemove', this.onDrag.bind(this));
    document.addEventListener('mouseup', this.endDrag.bind(this));
  }

  onDrag(event: MouseEvent): void {
    if (this.dragging && this.draggedElement) {
      this.draggedElement.positionX = event.clientX - this.offsetX;
      this.draggedElement.positionY = event.clientY - this.offsetY;
    }
  }

  endDrag(): void {
    if (this.dragging && this.draggedElement) {
      const closestColumn = Math.round(this.draggedElement.positionX / this.columnWidth) * this.columnWidth;
      const closestRow = Math.round(this.draggedElement.positionY / (this.rowHeight / 2)) * (this.rowHeight / 2);

      this.draggedElement.positionX = closestColumn;
      this.draggedElement.positionY = closestRow;

      this.dragging = false;
      this.draggedElement = null;

      document.removeEventListener('mousemove', this.onDrag.bind(this));
      document.removeEventListener('mouseup', this.endDrag.bind(this));
    }
  }

  //-------------------------------------CAMBIO DE FECHA-----------------------------------
  async cambioFecha(event: any): Promise<void> {
    try {
      this.loading = true;

      if (this.fecha_de_inicio > this.fecha_de_fin) {
        const nuevaFechaFin = new Date(this.fecha_de_inicio);
        nuevaFechaFin.setDate(nuevaFechaFin.getDate() + 14);
        this.fecha_de_fin = nuevaFechaFin;
      }

      // Reconfigurar dimensiones
      this.configurarDimensionesGrid();

      // Actualizar grilla
      this.updateGrid();

      // Recargar contenido
      await this.cargarContenidoCompleto();

      this.loading = false;
    } catch (error) {
      this.error = 'Error al cambiar fecha';
      this.loading = false;
      console.error('Error en cambioFecha:', error);
    }
  }

  //-------------------------------------GENERAR CALENDARIO-----------------------------------
  generarCalendario(): void {
    this.semanas = [];
    this.meses = [];

    let currentDate = new Date(this.fecha_de_inicio);
    const endDate = new Date(this.fecha_de_fin);

    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      this.semanas.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Actualizar columnas basado en semanas generadas
    this.columns = this.semanas.length + 1;

    const mesesMap = new Map<string, number>();
    this.semanas.forEach((fecha) => {
      const nombreMes = fecha.toLocaleString('default', { month: 'long' });
      mesesMap.set(nombreMes, (mesesMap.get(nombreMes) || 0) + 1);
    });

    this.meses = Array.from(mesesMap.entries()).map(([nombre, dias]) => ({
      nombre,
      dias
    }));

  }

  //----------------------------------CARGAR ENCABEZADO DEL CALENDARIO-----------------------------------
  async cargarEncabezadoCalendario(): Promise<void> {
    return new Promise((resolve) => {
      this.generarCalendario();
      this.encabezados = [];

      let columnaActual = 1;

      // Encabezados de meses
      this.meses.forEach((mes) => {
        const anchoColumnas = mes.dias;
        const randomColor = this.generarColorOscuro();

        this.encabezados.push({
          text: mes.nombre,
          position: {
            top: `${0}px`,
            left: `${columnaActual * this.columnWidth}px`
          },
          width: `${anchoColumnas * this.columnWidth}px`,
          height: `${this.rowHeight / 2}px`,
          backgroundColor: randomColor,
          textColor: '#ffffff'
        });

        columnaActual += anchoColumnas;
      });

      // Encabezados de días
      columnaActual = 1;
      this.semanas.forEach((fecha) => {
        const diaSemana = this.diasSemana[fecha.getDay()] + ' ' + fecha.getDate();
        const posicionX = columnaActual * this.columnWidth;
        let colorFondo = '#f0f0f0';
        if (fecha.getDay() === 0 || fecha.getDay() === 6) {
          colorFondo = '#d0d0d0';
        }

        this.encabezados.push({
          text: diaSemana,
          position: {
            top: `${this.rowHeight / 2}px`,
            left: `${posicionX}px`
          },
          width: `${this.columnWidth}px`,
          height: `${this.rowHeight / 2}px`,
          backgroundColor: colorFondo,
          textColor: '#000000'
        });
        columnaActual++;
      });

      resolve();
    });
  }

  //----------------------------------GENERAR COLOR OSCURO-----------------------------------
  private generarColorOscuro(): string {
    const r = Math.floor(Math.random() * 128);
    const g = Math.floor(Math.random() * 128);
    const b = Math.floor(Math.random() * 128);
    return `rgb(${r}, ${g}, ${b})`;
  }

  //----------------------------------COLOCAR TRANCAS EN LA TABLA-----------------------------------
  async cargarEncabezadoTranca(): Promise<void> {
    try {
      // Los datos ya están cargados en cargarDatosBase()
      this.encabezadosTranca = [];

      // Encabezado principal
      this.encabezadosTranca.push({
        text: 'TRANCAS',
        row: 1,
        position: {
          top: `${0}px`,
          left: `${0}px`
        },
        width: `${this.columnWidth}px`,
        height: `${this.rowHeight}px`,
        backgroundColor: '#900c3f',
        textColor: '#ffffff'
      });

      // Encabezados de trancas
      this.trancas.forEach((tranca, index) => {
        const posicionY = (index + 1) * this.rowHeight;
        this.encabezadosTranca.push({
          text: tranca.nombre,
          row: index + 2,
          position: {
            top: `${posicionY}px`,
            left: `${0}px`
          },
          width: `${this.columnWidth}px`,
          height: `${this.rowHeight}px`,
          backgroundColor: '#ff5733',
          textColor: '#ffffff'
        });
      });
      console.log(this.encabezadosTranca);

    } catch (error) {
      console.error('Error al cargar encabezados de trancas:', error);
      throw error;
    }
  }

  //----------------------------------CARGAR TURNOS EN MATRIZ-----------------------------------
  async cargarTurnosMatriz(): Promise<void> {
    this.listaTurnosMatriz = [];
    const turnosExcluidos: ITurnoUsuario[] = [];


    this.trancas.forEach(tranca => {
      const turnosTranca = this.turnos.filter(turno => turno.trancaId === tranca.id);

      turnosTranca.forEach(turno => {
        let fechaInicioTurno = this.normalizarFecha(new Date(turno.fecha_inicio));
        let fechaFinTurno = this.normalizarFecha(new Date(turno.fecha_fin));

        // Verificar si el turno está dentro del rango visible
        if (fechaFinTurno < this.fecha_de_inicio || fechaInicioTurno > this.fecha_de_fin) {
          turnosExcluidos.push(this.crearTurnoExcluido(turno, fechaInicioTurno, fechaFinTurno));
          return;
        }

        const fechaInicioAjustada = this.ajustarFechaInicio(fechaInicioTurno, this.fecha_de_inicio);
        const fechaFinAjustada = this.ajustarFechaFin(fechaFinTurno, this.fecha_de_fin);

        if (fechaInicioAjustada > fechaFinAjustada) {
          turnosExcluidos.push(this.crearTurnoExcluido(turno, fechaInicioAjustada, fechaFinAjustada));
          return;
        }

        const dias = this.calcularDiasAjustados(fechaInicioAjustada, fechaFinAjustada);
        const posicionAsignada = this.asignarTurnoAPosicion(fechaInicioAjustada, fechaFinAjustada, tranca.id, turno, dias);

        if (posicionAsignada === -1) {
          turnosExcluidos.push(this.crearTurnoExcluido(turno, fechaInicioAjustada, fechaFinAjustada, dias));
        }
      });
    });

  }

  //----------------------------------FUNCIONES AUXILIARES-----------------------------------
  private ajustarFechaInicio(fechaTurno: Date, fechaFiltro: Date): Date {
    const turnoInicio = this.normalizarFecha(fechaTurno);
    const filtroInicio = this.normalizarFecha(fechaFiltro);
    return filtroInicio > turnoInicio ? filtroInicio : turnoInicio;
  }

  private normalizarFecha(fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }

  private ajustarFechaFin(fechaTurno: Date, fechaFiltro: Date): Date {
    const turnoFin = this.normalizarFecha(fechaTurno);
    const filtroFin = this.normalizarFecha(fechaFiltro);
    return filtroFin < turnoFin ? filtroFin : turnoFin;
  }

  private calcularDiasAjustados(fechaIniAjustada: Date, fechaFinAjustada: Date): number {
    const diffMs = fechaFinAjustada.getTime() - fechaIniAjustada.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }

  private asignarTurnoAPosicion(fechaInicio: Date, fechaFin: Date, trancaId: number, turno: any, dias: number): number {
    for (let posicion = 1; posicion <= 2; posicion++) {
      if (!this.siFechaOcupada(this.listaTurnosMatriz, fechaInicio, fechaFin, posicion, trancaId)) {
        this.listaTurnosMatriz.push({
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          dias: dias,
          trancaId: trancaId,
          usuarioId: turno.usuarioId,
          posFila: posicion,
          nombreUsuario: turno.nombre_apellidos
        });
        return posicion;
      }
    }
    return -1;
  }

  public siFechaOcupada(turnoOcupados: ITurnoUsuario[], fechaIni: Date, fechaFin: Date, posFila: number, tranca_id: number): boolean {
    const inicio = this.normalizarFecha(fechaIni);
    const fin = this.normalizarFecha(fechaFin);

    for (const turno of turnoOcupados) {
      if (turno.trancaId === tranca_id && turno.posFila === posFila) {
        const turnoInicio = this.normalizarFecha(turno.fecha_inicio);
        const turnoFin = this.normalizarFecha(turno.fecha_fin);

        const haySolapamiento = (inicio <= turnoFin && fin >= turnoInicio);
        if (haySolapamiento) {
          return true;
        }
      }
    }
    return false;
  }

  private crearTurnoExcluido(turno: any, fechaInicio: Date, fechaFin: Date, dias: number = 0): ITurnoUsuario {
    return {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      dias: dias,
      trancaId: turno.trancaId,
      usuarioId: turno.usuarioId,
      posFila: -1,
      nombreUsuario: turno.nombre_apellidos,
    };
  }

  //-----------------------------------COLOCAR EN PANTALLA TODOS LOS TURNOS-----------------------------------
  async colocarTurnosEnPantalla(): Promise<void> {
    this.itemsTurnos = [];

    if (this.listaTurnosMatriz.length === 0) {
      return;
    }

    const filtroInicio = this.normalizarFecha(this.fecha_de_inicio);

    this.listaTurnosMatriz.forEach(turno => {
      const posX = turno.posFila === 2 ? 1 : 0;
      const fechaTurno = this.normalizarFecha(new Date(turno.fecha_inicio));
      const fechaact = Math.floor((fechaTurno.getTime() - filtroInicio.getTime()) / (1000 * 60 * 60 * 24));

      // Encontrar el índice de la tranca
      const trancaIndex = this.trancas.findIndex(t => t.id === turno.trancaId);

      const posicionX = (fechaact + 1) * this.columnWidth;
      const posicionY = (trancaIndex + 1) * this.rowHeight + (posX * this.rowHeight) / 2;
      const ancho = turno.dias * this.columnWidth;

      this.itemsTurnos.push({
        text: turno.nombreUsuario.toLowerCase(),
        positionX: posicionX,
        positionY: posicionY,
        width: ancho,
        height: this.rowHeight / 2,
        backgroundColor: this.generarColorClaro(),
        textColor: '#000000'
      });

    });

  }

  //-----------------------------------GENERAR COLORES CLAROS-----------------------------------
  private generarColorClaro(): string {
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    return `rgb(${r}, ${g}, ${b})`;
  }

  //-----------------------------------REDIMENSIONAMIENTO-----------------------------------
  startResize(event: MouseEvent, item: any): void {
    event.stopPropagation();
    this.resizingElement = item;
    this.initialMouseX = event.clientX;
    this.resizingElement.originalPositionX = item.positionX;
    this.resizingElement.originalPositionY = item.positionY;
    this.resizingElement.originalWidth = item.width;

    document.addEventListener('mousemove', this.onResize.bind(this));
    document.addEventListener('mouseup', this.endResize.bind(this));
  }

  onResize(event: MouseEvent): void {
    if (this.resizingElement) {
      const deltaX = event.clientX - this.initialMouseX;
      const newWidth = Math.max(this.resizingElement.originalWidth + deltaX, 50);
      this.resizingElement.width = newWidth;
      Object.assign(this.resizingElement, {
        positionX: this.resizingElement.originalPositionX,
        positionY: this.resizingElement.originalPositionY,
      });
    }
  }

  endResize(): void {
    if (this.resizingElement) {
      const roundedWidth = Math.round(this.resizingElement.width / this.itemWidth) * this.itemWidth;
      this.resizingElement.positionX = this.resizingElement.originalPositionX;
      this.resizingElement.positionY = this.resizingElement.originalPositionY;
      this.resizingElement.width = roundedWidth;
    }

    this.resizingElement = null;
    document.removeEventListener('mousemove', this.onResize.bind(this));
    document.removeEventListener('mouseup', this.endResize.bind(this));
  }

  //--------------------------------CLICK DERECHO PARA AGREGAR TURNOS-----------------------------------
  onRightClick(event: MouseEvent, cellIndex: number): void {
    event.preventDefault();

    const scrollableContainer = document.querySelector('.scrollable-container') as HTMLElement;
    const scrollLeft = scrollableContainer?.scrollLeft || 0;
    const scrollTop = scrollableContainer?.scrollTop || 0;
    const targetElement = event.target as HTMLElement;
    const top = targetElement.offsetTop;
    const left = targetElement.offsetLeft;

    this.dialogPosition = {
      x: event.pageX - scrollLeft,
      y: event.pageY - scrollTop,
    };
    this.posicionCreacion = {
      top: top,
      left: left
    };
    this.cellIndex = cellIndex;
    this.dialogVisible = true;
    this.crearDialogo = true;
  }

async cerrarDialogo(event: any): Promise<void> {
    await this.cargarDatosBase();
    await this.cambioFecha('s');
    this.crearDialogo = false;
    this.dialogVisible = false;
  }
}
