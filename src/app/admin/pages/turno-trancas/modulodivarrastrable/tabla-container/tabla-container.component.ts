import { Component, OnInit } from '@angular/core';
import { ITranca } from '@data/tranca.metadata';
import { ITurnoTrancaLista } from '@data/turno_tranca.metadata';
import { TrancaService } from 'src/app/admin/services/tranca.service';
interface IMes{
    nombre: string;
    dias: number;
}
@Component({
  selector: 'app-tabla-container',
  templateUrl: './tabla-container.component.html',
  styleUrls: ['./tabla-container.component.scss']
})
export class TablaContainerComponent implements OnInit {
  rows = 5; // Número de filas
  columns = 15; // Número de columnas
  columnWidth = 120; // Ancho de cada columna en píxeles
  rowHeight = 70; // Altura de cada fila en píxeles
  itemWidth = 100; // Ancho de los elementos dinámicos
  itemHeight = 30; // Altura de los elementos dinámicos
  items: any[] = []; // Lista de elementos dinámicos
  gridCells: any[] = []; // Referencias visuales de las celdas

  dragging = false;
  draggedElement: any = null;
  offsetX = 0;
  offsetY = 0;

    turnos: ITurnoTrancaLista[] = [];
    trancas: ITranca[] = [];
    semanas: Date[] = [];
    meses: IMes[] = [];
    encabezados: any[] = [];
    fecha_de_inicio: Date = new Date();
    fecha_de_fin: Date = new Date();
    loading = true;
    error=null;


  constructor(
    private trancaService: TrancaService,
) {
    this.updateGrid();

  }
  ngOnInit(): void {
    this.fecha_de_inicio = new Date();
    this.fecha_de_fin.setDate(this.fecha_de_fin.getDate() + this.columns-1);
    this.cargarTrancas();
    this.cargarEncabezadoCalendario();
  }

  //-----------------------------------PARA LAS GRILLAS-----------------------------------
  updateGrid(): void {
    // Actualiza las celdas según las filas y columnas
    this.gridCells = Array(this.rows * this.columns).fill(null);
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
      let nuevaFechaFin = new Date(this.fecha_de_inicio);
      nuevaFechaFin.setDate(nuevaFechaFin.getDate() + 14);
      this.fecha_de_fin = nuevaFechaFin;
    }

    // Calcular la diferencia de días entre fecha_de_inicio y fecha_de_fin, incluyendo el último día
    const diferenciaMilisegundos = this.fecha_de_fin.getTime() - this.fecha_de_inicio.getTime();
    this.columns = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 2; // Convertir milisegundos a días y sumar 1 para incluir el último día

    this.cargarTrancas();
    this.cargarEncabezadoCalendario();
  }
  //----------------------------------generar CELDAS-----------------------------------
  generarDatos(){

  }
  cargarTrancas(): void {
    this.trancaService.verTrancas('').subscribe({
      next: (response: any) => {
        this.trancas =this.trancaService.handleTrancas(response);
        this.rows=this.trancas.length+1;
        this.updateGrid();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las trancas';
        console.error(err);
      }
    });
  }
//-------------------------------------GENERAR CALENDARIO-----------------------------------
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

    console.log(this.meses); // Muestra los meses y días en la consola
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

    console.log(this.encabezados); // Muestra los encabezados generados en la consola
  }
  private generarColorOscuro(): string {
    const r = Math.floor(Math.random() * 128); // Valores bajos para rojo
    const g = Math.floor(Math.random() * 128); // Valores bajos para verde
    const b = Math.floor(Math.random() * 128); // Valores bajos para azul
    return `rgb(${r}, ${g}, ${b})`; // Retorna el color en formato RGB
  }
}
