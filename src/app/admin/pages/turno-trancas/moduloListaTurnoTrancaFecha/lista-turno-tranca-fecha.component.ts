import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { Component, OnInit } from '@angular/core';
import { ITranca } from '@data/tranca.metadata';
import { ITurnoTrancaLista } from '@data/turno_tranca.metadata';
import { TrancaService } from 'src/app/admin/services/tranca.service';
import { firstValueFrom } from 'rxjs';
import { IFuncionarioTranca } from '@data/funcionarioTranca.metadata';
import { ToastrService } from 'ngx-toastr';
import { TurnoValidatorService } from '../services/validar-turno.service';

interface IMes{
    nombre: string;
    dias: number;
}
interface IColores{
    fondo:string;
    borde:string;
}
interface IFuncionarioColor{
    id:number;
    color:IColores;
}

interface ITurnoUsuario{
    id:number
    fecha_fin: Date;
    fecha_inicio: Date;
    dias: number;
    trancaId: number;
    usuarioId: number;
    posFila: number;
    nombreUsuario: string;
}

@Component({
  selector: 'app-lista-turno-tranca-fecha',
  templateUrl: './lista-turno-tranca-fecha.component.html',
  styleUrls: ['./lista-turno-tranca-fecha.component.scss']
})
export class ListaTurnoTrancaFechaComponent implements OnInit {
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
  funcionarios:IFuncionarioTranca[]=[];
  funcionarioColor:IFuncionarioColor[]=[];

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
    private validador:TurnoValidatorService,
    private notify:ToastrService,
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
      await this.asignarColorFuncionario()
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
    //   Cargar Funcionarios



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
      const closestRow = Math.round(this.draggedElement.positionY / (this.rowHeight / 4)) * (this.rowHeight / 4);

    this.draggedElement.positionX = closestColumn;
    this.draggedElement.positionY = closestRow;
    this.updateTurno(this.draggedElement);
    this.dragging = false;
    this.draggedElement = null;

    document.removeEventListener('mousemove', this.onDrag.bind(this));
    document.removeEventListener('mouseup', this.endDrag.bind(this));
    }
  }
//-------------------------------------UPDATE TURNO------------------------------------------------
updateTurno(item:any){
    const posicion={
        top:item.positionY,
        left:item.positionX
    }
    let fecha_ini=this.validador.obtenerFechaClick(this.semanas,this.columnWidth,posicion);
    let tranca=this.validador.obtenerTrancaClick(this.trancas,this.rowHeight,posicion);
    let nuevos_turnos = this.turnos.filter(t => t.id !== item.id);
    let dias=item.width/this.columnWidth;
    let fecha_fin=this.validador.calcularFechaFin(fecha_ini,dias);
    let turnoUpdate:ITurnoTrancaLista={
        id:item.id,
        trancaId:tranca.id,
        usuarioId:item.usuarioId,
        fecha_inicio:fecha_ini.toISOString(),
        fecha_fin:fecha_fin,
    }
    let sw=this.validador.validarTurno(turnoUpdate,nuevos_turnos)
    if(turnoUpdate.usuarioId && turnoUpdate.trancaId && turnoUpdate.fecha_inicio && turnoUpdate.fecha_fin && sw.valido==true && dias>0 )
        {
            this.turnoTrancaService.editarTurnoTranca(turnoUpdate).subscribe({
                next: (response: any) => {

                    this.notify.success('Actualizado Correctamente','Se reasigno el Turno ',{timeOut:2500,positionClass: 'toast-top-right'});
                    this.cambioFecha('');
                },
                error: (err) => {
                    this.cambioFecha('');
                    this.error = 'Error al alctualizar el turno';
                    console.error(err);
                }
            })
        }
        else{
            this.cambioFecha('');
            if(sw.valido){
                this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con la Actualización de Turno',{timeOut:2000,positionClass: 'toast-top-right'});
            }else{
                this.notify.error(sw.mensaje,'Error con la Actualización de Turno',{timeOut:2000,positionClass: 'toast-top-right'});
            }
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
      await this.cargarDatosBase();
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
  // VERSIÓN MEJORADA CON CORRECCIONES

async cargarTurnosMatriz(): Promise<void> {
    this.listaTurnosMatriz = [];
    const turnosExcluidos: ITurnoUsuario[] = [];

    // Ordenar turnos por fecha de inicio para mejor asignación
    const turnosOrdenados = this.turnos.sort((a, b) =>
        new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime()
    );

    this.trancas.forEach(tranca => {
        const turnosTranca = turnosOrdenados.filter(turno => turno.trancaId === tranca.id);

        turnosTranca.forEach(turno => {
            let fechaInicioTurno = this.normalizarFecha(new Date(turno.fecha_inicio));
            let fechaFinTurno = this.normalizarFecha(new Date(turno.fecha_fin));

            // Verificar si el turno está dentro del rango visible
            if (fechaFinTurno < this.fecha_de_inicio || fechaInicioTurno > this.fecha_de_fin) {
                turnosExcluidos.push(this.crearTurnoExcluido(turno.id, turno, fechaInicioTurno, fechaFinTurno));
                return;
            }

            const fechaInicioAjustada = this.ajustarFechaInicio(fechaInicioTurno, this.fecha_de_inicio);
            const fechaFinAjustada = this.ajustarFechaFin(fechaFinTurno, this.fecha_de_fin);

            if (fechaInicioAjustada > fechaFinAjustada) {
                turnosExcluidos.push(this.crearTurnoExcluido(turno.id, turno, fechaInicioAjustada, fechaFinAjustada));
                return;
            }

            const dias = this.calcularDiasAjustados(fechaInicioAjustada, fechaFinAjustada);
            const posicionAsignada = this.asignarTurnoAPosicion(turno.id, fechaInicioAjustada, fechaFinAjustada, tranca.id, turno, dias);

            if (posicionAsignada === -1) {
                turnosExcluidos.push(this.crearTurnoExcluido(turno.id, turno, fechaInicioAjustada, fechaFinAjustada, dias));
                console.warn(`Turno ${turno.id} no pudo ser asignado - posible solapamiento`);
            }
        });
    });

    console.log(`Turnos asignados: ${this.listaTurnosMatriz.length}, Turnos excluidos: ${turnosExcluidos.length}`);
}

// FUNCIONES AUXILIARES MEJORADAS
private ajustarFechaInicio(fechaTurno: Date, fechaFiltro: Date): Date {
    const turnoInicio = this.normalizarFecha(fechaTurno);
    const filtroInicio = this.normalizarFecha(fechaFiltro);
    return filtroInicio > turnoInicio ? filtroInicio : turnoInicio;
}

private normalizarFecha(fecha: Date): Date {
    const fechaNormalizada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    // Resetear la hora para evitar problemas de comparación
    fechaNormalizada.setHours(0, 0, 0, 0);
    return fechaNormalizada;
}

private ajustarFechaFin(fechaTurno: Date, fechaFiltro: Date): Date {
    const turnoFin = this.normalizarFecha(fechaTurno);
    const filtroFin = this.normalizarFecha(fechaFiltro);
    return filtroFin < turnoFin ? filtroFin : turnoFin;
}

private calcularDiasAjustados(fechaIniAjustada: Date, fechaFinAjustada: Date): number {
    const diffMs = fechaFinAjustada.getTime() - fechaIniAjustada.getTime();
    const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, dias); // Asegurar que sea al menos 1 día
}

// ASIGNACIÓN MEJORADA CON MEJOR ALGORITMO
private asignarTurnoAPosicion(id: number, fechaInicio: Date, fechaFin: Date, trancaId: number, turno: any, dias: number): number {
    // Intentar asignar en la posición más óptima
    for (let posicion = 1; posicion <= 4; posicion++) {
        if (!this.siFechaOcupada(this.listaTurnosMatriz, fechaInicio, fechaFin, posicion, trancaId)) {
            this.listaTurnosMatriz.push({
                id: id,
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

// VERIFICACIÓN DE OCUPACIÓN MEJORADA
public siFechaOcupada(turnoOcupados: ITurnoUsuario[], fechaIni: Date, fechaFin: Date, posFila: number, tranca_id: number): boolean {
    const inicio = this.normalizarFecha(fechaIni);
    const fin = this.normalizarFecha(fechaFin);

    for (const turno of turnoOcupados) {
        if (turno.trancaId === tranca_id && turno.posFila === posFila) {
            const turnoInicio = this.normalizarFecha(turno.fecha_inicio);
            const turnoFin = this.normalizarFecha(turno.fecha_fin);

            // Verificación más precisa de solapamiento
            const haySolapamiento = (inicio <= turnoFin && fin >= turnoInicio);

            if (haySolapamiento) {
                console.log(`Solapamiento detectado - Turno existente: ${turno.id} (${turnoInicio.toDateString()} - ${turnoFin.toDateString()}) vs Nuevo: (${inicio.toDateString()} - ${fin.toDateString()})`);
                return true;
            }
        }
    }
    return false;
}

private crearTurnoExcluido(id: number, turno: any, fechaInicio: Date, fechaFin: Date, dias: number = 0): ITurnoUsuario {
    return {
        id: id,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        dias: dias,
        trancaId: turno.trancaId,
        usuarioId: turno.usuarioId,
        posFila: -1,
        nombreUsuario: turno.nombre_apellidos,
    };
}

// COLOCACIÓN EN PANTALLA MEJORADA
async colocarTurnosEnPantalla(): Promise<void> {
    this.itemsTurnos = [];

    if (this.listaTurnosMatriz.length === 0) {
        console.warn('No hay turnos en la matriz para mostrar');
        return;
    }

    const filtroInicio = this.normalizarFecha(this.fecha_de_inicio);
    await this.asignarColorFuncionario();

    console.log(`Colocando ${this.listaTurnosMatriz.length} turnos en pantalla`);

    this.listaTurnosMatriz.forEach((turno, index) => {
        try {
            // Validar que el turno tenga una posición válida
            if (turno.posFila === -1) {
                console.warn(`Turno ${turno.id} tiene posición inválida (-1)`);
                return;
            }

            const posX = Math.max(0, turno.posFila - 1);
            const fechaTurno = this.normalizarFecha(new Date(turno.fecha_inicio));
            const fechaact = Math.floor((fechaTurno.getTime() - filtroInicio.getTime()) / (1000 * 60 * 60 * 24));

            // Validar que fechaact no sea negativo
            if (fechaact < 0) {
                console.warn(`Turno ${turno.id} tiene fecha anterior al filtro de inicio`);
                return;
            }

            // Encontrar el índice de la tranca
            const trancaIndex = this.trancas.findIndex(t => t.id === turno.trancaId);

            if (trancaIndex === -1) {
                console.warn(`Tranca ${turno.trancaId} no encontrada para turno ${turno.id}`);
                return;
            }

            const posicionX = (fechaact + 1) * this.columnWidth;
            const posicionY = (trancaIndex + 1) * this.rowHeight + (posX * this.rowHeight) / 4;
            const ancho = turno.dias * this.columnWidth;

            // Validar dimensiones
            if (ancho <= 0 || posicionX < 0 || posicionY < 0) {
                console.warn(`Turno ${turno.id} tiene dimensiones inválidas - ancho: ${ancho}, posX: ${posicionX}, posY: ${posicionY}`);
                return;
            }

            let color = 'rgb(143,188,143)';
            let colorBorde = 'rgb(143,188,143)';
            let funcColor = this.funcionarioColor.find(funcColor => funcColor.id === turno.usuarioId);

            if (funcColor) {
                color = funcColor.color.fondo;
                colorBorde = funcColor.color.borde;
            }

            this.itemsTurnos.push({
                id: turno.id,
                text: turno.nombreUsuario.toLowerCase(),
                usuarioId: turno.usuarioId,
                positionX: posicionX,
                positionY: posicionY,
                width: ancho,
                height: this.rowHeight / 4,
                backgroundColor: color,
                borderColor: colorBorde,
                textColor: '#000000'
            });

        } catch (error) {
            console.error(`Error procesando turno ${turno.id}:`, error);
        }
    });

    console.log(`Items de turnos creados: ${this.itemsTurnos.length}`);
}

// FUNCIÓN ADICIONAL PARA DEBUGGING
private validarConsistenciaDatos(): void {
    console.log('=== VALIDACIÓN DE CONSISTENCIA ===');
    console.log(`Turnos originales: ${this.turnos.length}`);
    console.log(`Turnos en matriz: ${this.listaTurnosMatriz.length}`);
    console.log(`Items en pantalla: ${this.itemsTurnos.length}`);

    // Verificar turnos duplicados
    const idsUnicos = new Set(this.listaTurnosMatriz.map(t => t.id));
    if (idsUnicos.size !== this.listaTurnosMatriz.length) {
        console.warn('¡Turnos duplicados detectados en la matriz!');
    }

    // Verificar posiciones válidas
    const turnosConPosicionInvalida = this.listaTurnosMatriz.filter(t => t.posFila === -1);
    if (turnosConPosicionInvalida.length > 0) {
        console.warn(`${turnosConPosicionInvalida.length} turnos con posición inválida`);
    }
}

//-----------------------------------GENERAR COLORES CLAROS-----------------------------------
private tonosUsados: number[] = [];
private generarColorClaro(): IColores {
    const MIN_DISTANCIA = 60; // Distancia mínima entre tonos

    let h: number;
    let intentos = 0;
    const maxIntentos = 100;

    // 1. Buscar un tono no usado (igual que antes)
    do {
        h = Math.floor(Math.random() * 360);
        intentos++;

        if (this.tonosUsados.length === 0 ||
            this.tonosUsados.every(tono =>
                Math.abs(tono - h) > MIN_DISTANCIA &&
                Math.abs(tono - h) < (360 - MIN_DISTANCIA)
            )) {
            break;
        }
    } while (intentos < maxIntentos);

    // 2. Resetear si no se encuentra un tono válido
    if (intentos >= maxIntentos) {
        this.tonosUsados = [];
        h = Math.floor(Math.random() * 360);
    }
    this.tonosUsados.push(h);

    // 3. Generar saturación y luminosidad (colores claros)
    const s = Math.floor(Math.random() * 30) + 70; // 70-100%
    const l = Math.floor(Math.random() * 15) + 80; // 80-95%

    // 4. Borde: mismo tono y saturación, pero 25% menos luminosidad
    const bordeL = Math.max(20, l - 25); // Asegurar que no sea negativo

    return {
        fondo: `hsl(${h}, ${s}%, ${l}%)`,
        borde: `hsl(${h}, ${s}%, ${bordeL}%)`
    };
}
     private async asignarColorFuncionario(): Promise<void> {
        const responseFuncionarios: any = await firstValueFrom(this.turnoTrancaService.verFuncionarioTrancas(''));
        this.funcionarios = this.turnoTrancaService.handleListarFuncionarioTrancas(responseFuncionarios);
        this.funcionarios.forEach(funcionario => {
            this.funcionarioColor.push({
                id: funcionario.id,
                color: this.generarColorClaro()
            });
        });
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
      this.updateTurno(this.resizingElement)
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
