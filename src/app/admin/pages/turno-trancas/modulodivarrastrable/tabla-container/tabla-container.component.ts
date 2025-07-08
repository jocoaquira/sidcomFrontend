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
    nombreUsuario: string; // Opcional, si se quiere mostrar el nombre del usuario
}
@Component({
  selector: 'app-tabla-container',
  templateUrl: './tabla-container.component.html',
  styleUrls: ['./tabla-container.component.scss']
})
export class TablaContainerComponent implements OnInit {
  rows = 5; // Número de filas
  columns = 15; // Número de columnas
  columnWidth = 100; // Ancho de cada columna en píxeles
  rowHeight = 60; // Altura de cada fila en píxeles
  itemWidth = 100; // Ancho de los elementos dinámicos
  itemHeight = 30; // Altura de los elementos dinámicos
  items: any[] = []; // Lista de elementos dinámicos
  itemsTurnos: any[] = []; // Lista de turnos de usuarios
  gridCells: any[] = []; // Referencias visuales de las celdas
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


  constructor(
    private trancaService: TrancaService,
    private turnoTrancaService: TurnoTrancaService,
) {
    this.updateGrid();
  }
  async ngOnInit() {
    this.fecha_de_inicio = new Date();
    this.fecha_de_inicio.setHours(0, 0, 0, 0);
    this.fecha_de_fin.setDate(this.fecha_de_fin.getDate() + this.columns-1);
    this.fecha_de_fin.setHours(0, 0, 0, 0);
    this.cargarEncabezadoCalendario();
    this.cargarEncabezadoTranca();
    this.colocarTurnosEnPantalla();
    console.log('oninit');
  }

  //-----------------------------------PARA LAS GRILLAS-----------------------------------
  updateGrid(): void {
    // Actualiza las celdas según las filas y columnas
    this.gridCells = Array(this.rows * this.columns).fill(null);
    console.log(this.gridCells);
  }

  generateGridRows(): string {
    return `repeat(${this.rows}, ${this.rowHeight}px)`; // Define la altura de cada fila
  }

  generateGridColumns(): string {
    return `repeat(${this.columns}, ${this.columnWidth}px)`; // Define el ancho de cada columna
  }
//---------------------------------AGREGAR TURNOS DE USUARIOS-----------------------------------
  agregarTurnoUsuario(): void {
    this.items.push({
      text: `Componente dinámico ${Math.random().toFixed(2)}`,
      backgroundColor: '#3f51b5',
      textColor: '#ffffff',
      positionX: 0, // Posición inicial en X
      positionY: 0, // Posición inicial en Y
      width: this.itemWidth, // Ancho del elemento
      height: this.itemHeight // Altura del elemento
    });
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
      // Calcular la columna más cercana
      const closestColumn = Math.round(this.draggedElement.positionX / this.columnWidth) * this.columnWidth;

      // Calcular la fila más cercana, permitiendo posicionarse en la mitad de las filas
      const closestRow = Math.round(this.draggedElement.positionY / (this.rowHeight / 2)) * (this.rowHeight / 2);

      // Ajustar la posición del elemento
      this.draggedElement.positionX = closestColumn+3;
      this.draggedElement.positionY = closestRow+3;

      // Finalizar el arrastre
      this.dragging = false;
      this.draggedElement = null;

      document.removeEventListener('mousemove', this.onDrag.bind(this));
      document.removeEventListener('mouseup', this.endDrag.bind(this));
    }
  }
  //-------------------------------------FIN ARRASTRE-----------------------------------
cambioFecha(event: any): void {
  if (this.fecha_de_inicio > this.fecha_de_fin) {
    const nuevaFechaFin = new Date(this.fecha_de_inicio);
    nuevaFechaFin.setDate(nuevaFechaFin.getDate() + 14);
    this.fecha_de_fin = nuevaFechaFin;
  }

  // Calcular columnas
  const diferenciaMilisegundos = this.fecha_de_fin.getTime() - this.fecha_de_inicio.getTime();
  this.columns = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;

  // 🔧 ACTUALIZAR LA GRILLA
  this.updateGrid();

  // 🔁 Recargar encabezados y turnos
  this.cargarEncabezadoTranca();
  this.cargarEncabezadoCalendario();
  this.colocarTurnosEnPantalla();
}

//-------------------------------------GENERAR CALENDARIO-----------------------------------
/*
generarCalendario(): void {
    this.semanas = [];
    this.meses = []; // Reinicia el array de meses
    let currentDate = new Date(this.fecha_de_inicio);

    while (currentDate <= this.fecha_de_fin) {
      this.semanas.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Agrupar las fechas por mes
    const mesesMap = new Map<string, number>();

    this.semanas.forEach((fecha) => {
      const nombreMes = fecha.toLocaleString('default', { month: 'long' }); // Obtiene el nombre del mes
      if (mesesMap.has(nombreMes)) {
        mesesMap.set(nombreMes, mesesMap.get(nombreMes)! + 1); // Incrementa el contador de días
      } else {
        mesesMap.set(nombreMes, 1); // Inicializa el contador de días
      }
    });

    // Convertir el Map a un array de objetos
    this.meses = Array.from(mesesMap.entries()).map(([nombre, dias]) => ({
      nombre,
      dias
    }));
    this.semanas.forEach((fecha) => {

    });

  }
*/
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

    // Actualizar el número de columnas y grid
    this.columns = this.semanas.length+1;
    this.updateGrid();

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
  cargarEncabezadoCalendario(): void {
    this.generarCalendario(); // Genera los meses y días
    this.encabezados = [];

    let columnaActual = 1; // Posición inicial en columnas después de la primera columna

    this.meses.forEach((mes) => {
      const anchoColumnas = mes.dias; // El ancho en columnas es igual a la cantidad de días del mes

      // Generar un color aleatorio oscuro
      const randomColor = this.generarColorOscuro();

      this.encabezados.push({
        text: mes.nombre, // Nombre del mes
        position: {
          top: `${0}px`, // Mitad de la primera fila
          left: `${columnaActual * this.columnWidth}px` // Posición inicial en columnas
        },
        width: `${anchoColumnas * this.columnWidth}px`, // Ancho basado en las columnas
        height: `${this.rowHeight / 2}px`, // Altura de la mitad de la fila
        backgroundColor: randomColor, // Color de fondo aleatorio oscuro
        textColor: '#ffffff' // Color del texto blanco
      });

      columnaActual += anchoColumnas; // Avanza a la siguiente posición inicial
    });
    columnaActual = 1; // Reinicia la posición de columna para los días de la semana
    this.semanas.forEach((fecha) => {
        const diaSemana = this.diasSemana[fecha.getDay()]+' '+fecha.getDate(); // Obtiene el nombre del día de la semana
        const posicionX = columnaActual * this.columnWidth; // Calcula la posición X en base a la columna actual
        let colorFondo = '#f0f0f0'; // Color de fondo claro por defecto
        if (fecha.getDay() === 0 || fecha.getDay() === 6) { // Si es domingo o sábado
            colorFondo = '#d0d0d0'; // Color de fondo diferente para fines de semana
        }
        this.encabezados.push({
            text: diaSemana, // Nombre del día de la semana
            position: {
            top: `${this.rowHeight / 2}px`, // Posición en la mitad de la fila
            left: `${posicionX}px` // Posición X calculada
            },
            width: `${this.columnWidth}px`, // Ancho de la columna
            height: `${this.rowHeight / 2}px`, // Altura de la mitad de la fila
            backgroundColor: colorFondo, // Color de fondo claro para los días de la semana
            textColor: '#000000' // Color del
        });
        columnaActual++; // Avanza a la siguiente columna
    });

  }
  //----------------------------------GENERAR COLOR OSCURO-----------------------------------
  private generarColorOscuro(): string {
    const r = Math.floor(Math.random() * 128); // Valores bajos para rojo
    const g = Math.floor(Math.random() * 128); // Valores bajos para verde
    const b = Math.floor(Math.random() * 128); // Valores bajos para azul
    return `rgb(${r}, ${g}, ${b})`; // Retorna el color en formato RGB
  }
  //----------------------------------COLOCAR TRANCAS EN LA TABLA-----------------------------------
  cargarEncabezadoTranca(): void {
  this.trancaService.verTrancas('').subscribe({
    next: (response: any) => {
      this.trancas = this.trancaService.handleTrancas(response);
      this.rows = this.trancas.length + 1;
      this.encabezadosTranca = []; // Limpia antes de llenar

        this.encabezadosTranca.push({
            text: 'TRANCAS', // Nombre de la tranca
            row: 1, // Fila 2 en adelante
            position: {
            top: `${0}px`,
            left: `${0}px` // Posición X calculada
            },
            width: `${this.columnWidth}px`, // Ancho de la columna
            height: `${this.rowHeight}px`, // Altura de la mitad de la fila
            backgroundColor: '#900c3f ', // Color de fondo claro para los días de la semana
            textColor: '#ffffff' // Color del
        });


      this.trancas.forEach((tranca, index) => {
        const posicionY = (index + 1) * this.rowHeight;
        this.encabezadosTranca.push({
            text: tranca.nombre, // Nombre de la tranca
            row: index + 2, // Fila 2 en adelante
            position: {
            top: `${0}px`,
            left: `${posicionY}px` // Posición X calculada
            },
            width: `${this.columnWidth}px`, // Ancho de la columna
            height: `${this.rowHeight}px`, // Altura de la mitad de la fila
            backgroundColor: '#ff5733', // Color de fondo claro para los días de la semana
            textColor: '#ffffff' // Color del
        });
      });
      this.loading = false;

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
        console.log(this.turnos);
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Error al cargar los turnos';
      this.loading = false;
      console.error(err);
    }
  });
}
//----------------------------------CARGAR TURNOS EN MATRIZ-----------------------------------
async cargarTurnosMatriz() {
    this.listaTurnosMatriz = [];
    const turnosExcluidos: ITurnoUsuario[] = [];

    await this.cargarTurnos();
    await this.cargarEncabezadoTranca();

    this.trancas.forEach(tranca => {
      const turnosTranca = this.turnos.filter(turno => turno.trancaId === tranca.id);

      turnosTranca.forEach(turno => {
        let fechaInicioTurno = this.normalizarFecha(new Date(turno.fecha_inicio));
        let fechaFinTurno = this.normalizarFecha(new Date(turno.fecha_fin));

        if (fechaFinTurno < this.fecha_de_inicio || fechaInicioTurno > this.fecha_de_fin) {
            turnosExcluidos.push(this.crearTurnoExcluido(turno, fechaInicioTurno, fechaFinTurno));
            return;
        }
        // Ajustar el rango según los filtros aplicados
        const fechaInicioAjustada = this.ajustarFechaInicio(fechaInicioTurno, this.fecha_de_inicio);
        const fechaFinAjustada = this.ajustarFechaFin(fechaFinTurno, this.fecha_de_fin);

        // Verificar validez del rango ajustado
        if (fechaInicioAjustada > fechaFinAjustada) {
          turnosExcluidos.push(this.crearTurnoExcluido(turno, fechaInicioAjustada, fechaFinAjustada));
          return;
        }

        // Calcular días correctamente considerando el ajuste
        const dias = this.calcularDiasAjustados(
          fechaInicioAjustada,
          fechaFinAjustada
        );

        // Asignar turno a posición disponible
        const posicionAsignada = this.asignarTurnoAPosicion(
          fechaInicioAjustada,
          fechaFinAjustada,
          tranca.id,
          turno,
          dias
        );

        if (posicionAsignada === -1) {
          turnosExcluidos.push(this.crearTurnoExcluido(turno, fechaInicioAjustada, fechaFinAjustada, dias));
        }
      });
    });

    console.log('Turnos asignados:', this.listaTurnosMatriz);
    console.log('Turnos excluidos:', turnosExcluidos);
}

//----------------------------------FUNCIONES AUXILIARES SIMPLIFICADAS (SOLO FECHAS)-----------------------------------

/**
 * Ajusta la fecha de inicio del turno según el filtro, eliminando la hora.
 */
private ajustarFechaInicio(fechaTurno: Date, fechaFiltro: Date): Date {
    const turnoInicio = this.normalizarFecha(fechaTurno);
    const filtroInicio = this.normalizarFecha(fechaFiltro);
    if(filtroInicio>turnoInicio){
        return filtroInicio
    }
    else{
        return turnoInicio
    }
}
private normalizarFecha(fecha: Date): Date {
    console.log('normalizarFecha', fecha);
    console.log('fecha normalizada', new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }
/**
 * Ajusta la fecha de fin del turno según el filtro, eliminando la hora.
 */
private ajustarFechaFin(fechaTurno: Date, fechaFiltro: Date): Date {
    const turnoInicio = this.normalizarFecha(fechaTurno);
    const filtroInicio = this.normalizarFecha(fechaFiltro);
    if(filtroInicio < turnoInicio) {
        console.log('fecha filtro', turnoInicio);
        console.log('fecha turno', filtroInicio);
        return filtroInicio;
    } else {
        return turnoInicio;
    }
}

/**
 * Normaliza una fecha eliminando la hora (dejando solo año, mes y día).
 */


/**
 * Calcula la cantidad de días entre dos fechas ajustadas.
 */
private calcularDiasAjustados(
    fechaIniAjustada: Date,
    fechaFinAjustada: Date
): number {


    const diffMs = fechaFinAjustada.getTime() - fechaIniAjustada.getTime();
    const diasAjustados = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    return diasAjustados;
}

/**
 * Calcula la diferencia de días exacta entre dos fechas (sin considerar horas).
 */
private calcularDiasDiferencia(fechaIni: Date, fechaFin: Date): number {
    const inicio = this.normalizarFecha(fechaIni);
    const fin = this.normalizarFecha(fechaFin);

    const diffTiempo = fin.getTime() - inicio.getTime();
    return Math.floor(diffTiempo / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Asigna el turno a la primera posición disponible en la matriz.
 */
private asignarTurnoAPosicion(
    fechaInicio: Date,
    fechaFin: Date,
    trancaId: number,
    turno: any,
    dias: number
): number {
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

/**
 * Verifica si una fecha ya está ocupada en la misma fila y tranca.
 */
public siFechaOcupada(
    turnoOcupados: ITurnoUsuario[],
    fechaIni: Date,
    fechaFin: Date,
    posFila: number,
    tranca_id: number
): boolean {
    const inicio = this.normalizarFecha(fechaIni);
    const fin = this.normalizarFecha(fechaFin);

    for (const turno of turnoOcupados) {
        if (turno.trancaId === tranca_id && turno.posFila === posFila) {
            const turnoInicio = this.normalizarFecha(turno.fecha_inicio);
            const turnoFin = this.normalizarFecha(turno.fecha_fin);

            const haySolapamiento = (
                inicio <= turnoFin && fin >= turnoInicio
            );

            if (haySolapamiento) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Crea un objeto de turno excluido cuando no se puede asignar.
 */
private crearTurnoExcluido(
    turno: any,
    fechaInicio: Date,
    fechaFin: Date,
    dias: number = 0
): ITurnoUsuario {
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
async colocarTurnosEnPantalla() {
    console.log('colocarTurnosEnPantalla');
    await this.cargarTurnosMatriz();
    this.itemsTurnos = [];

    const filtroInicio = this.normalizarFecha(this.fecha_de_inicio);

    this.listaTurnosMatriz.forEach(turno => {
      let posX = turno.posFila === 2 ? 1 : 0;

      const fechaTurno = this.normalizarFecha(new Date(turno.fecha_inicio));

      const fechaact = Math.floor(
        (fechaTurno.getTime() - filtroInicio.getTime()) / (1000 * 60 * 60 * 24)
      );


      const posicionX = (fechaact + 1) * this.columnWidth;

      const posicionY = turno.trancaId * this.rowHeight + (posX * this.rowHeight) / 2;
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

      // Debug
      console.log(`Turno: ${turno.nombreUsuario} - fechaact: ${fechaact} - posición X: ${posicionX}`);
    });

    console.log('itemsTurnos', this.itemsTurnos);
  }


//-----------------------------------GENERAR COLORES CLAROS-----------------------------------
    private generarColorClaro(): string {
        const r = Math.floor(Math.random() * 128) + 128; // Valores altos para rojo
        const g = Math.floor(Math.random() * 128) + 128; // Valores altos para verde
        const b = Math.floor(Math.random() * 128) + 128; // Valores altos para azul
        return `rgb(${r}, ${g}, ${b})`; // Retorna el color en formato RGB
    }
//-----------------------------------INICIAR REDIMENSIONAMIENTO-----------------------------------
private resizingElement: any = null;
private initialMouseX: number = 0;

startResize(event: MouseEvent, item: any): void {
    event.stopPropagation(); // <--- Esto evita que se dispare startDrag

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
      const newWidth = Math.max(this.resizingElement.originalWidth + deltaX, 50); // Mínimo ancho de 50px

      // Ajustar el ancho directamente
      this.resizingElement.width = newWidth;

      // Mantener las posiciones originales sin permitir que cambien
      Object.assign(this.resizingElement, {
        positionX: this.resizingElement.originalPositionX,
        positionY: this.resizingElement.originalPositionY,
      });

      console.log('Nuevo ancho:', this.resizingElement.width);
      console.log('Posición fija durante el redimensionamiento:', {
        positionX: this.resizingElement.positionX,
        positionY: this.resizingElement.positionY,
      });
    }
  }
  endResize(): void {
    if (this.resizingElement) {
      // Redondear el ancho al múltiplo de itemWidth más cercano
      const roundedWidth = Math.round(this.resizingElement.width / this.itemWidth) * this.itemWidth;

      // Restaurar las posiciones originales
      this.resizingElement.positionX = this.resizingElement.originalPositionX;
      this.resizingElement.positionY = this.resizingElement.originalPositionY;

      // Ajustar el ancho redondeado
      this.resizingElement.width = roundedWidth;

      console.log('Posición final ajustada:', {
        positionX: this.resizingElement.positionX,
        positionY: this.resizingElement.positionY,
        width: this.resizingElement.width,
      });
    }

    // Finalizar el redimensionamiento
    this.resizingElement = null;
    document.removeEventListener('mousemove', this.onResize.bind(this));
    document.removeEventListener('mouseup', this.endResize.bind(this));
  }
  //--------------------------------CLICK DERECHO PARA AGRERGAR TURNOS-----------------------------------
  dialogVisible: boolean = false; // Controla la visibilidad del diálogo
dialogPosition: { x: number; y: number } | null = null; // Posición del diálogo
cellIndex: number | null = null; // Índice de la celda seleccionada

onRightClick(event: MouseEvent, cellIndex: number): void {
    event.preventDefault();

    const scrollableContainer = document.querySelector('.scrollable-container') as HTMLElement;
    const scrollLeft = scrollableContainer?.scrollLeft || 0;
    const scrollTop = scrollableContainer?.scrollTop || 0;
    const targetElement = event.target as HTMLElement; // Obtener el elemento clicado
    const top = targetElement.offsetTop; // Posición vertical relativa al contenedor
    const left = targetElement.offsetLeft; // Posición horizontal relativa al contenedor
  
    this.dialogPosition = {
      x: event.pageX - scrollLeft,
      y: event.pageY - scrollTop,
    };
    this.posicionCreacion={
        top: top, // Ajusta la posición Y
        left: left // Ajusta la posición X
    }
    this.cellIndex = cellIndex;
    console.log('celda',cellIndex);
    this.dialogVisible = true;
    this.crearDialogo=true;
  }

agregarDiv(): void {
  console.log('Agregar div dinámico en la celda:', this.cellIndex);
  // Aquí puedes implementar la lógica para agregar un div dinámico
  this.dialogVisible = false; // Ocultar el diálogo después de agregar el div
}
  mostrarDialogoAgregarDiv(position: { x: number; y: number }, cellIndex: number): void {
    // Implementa la lógica para mostrar el diálogo en la posición del clic
    console.log('Mostrar diálogo en posición:', position, 'para la celda:', cellIndex);

    // Ejemplo: Puedes usar un servicio de diálogo o una variable para controlar la visibilidad
    this.dialogVisible = true;
    this.dialogPosition = position;
  }
  //-----------------------------------CERRAR DIALOGO CREAR-----------------------------------
  cerrarDialogo(event:any): void {
    this.crearDialogo = false; 
}

}
