import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ITranca } from '@data/tranca.metadata';

@Component({
  selector: 'app-crear-turno',
  templateUrl: './crear-turno.component.html',
  styleUrls: ['./crear-turno.component.scss']
})
export class CrearTurnoComponent implements OnInit {
  @Input() position: { top?: number; left?: number } = { top: 0, left: 0 };
  @Input() semanas: Date[] = [];
  @Input() listaTurnos: any[] = [];
  @Input() trancas: ITranca[] = [];
  @Input() ancho: number = 0;
  @Input() alto: number = 0;
  @Input() columnas: number = 0;
  @Input() filas: number = 0;
@Output() estadoDialogo = new EventEmitter<boolean>();
  public error: any=null;
  public dias:number=4;
  public fecha:Date | null = null;
  public tranca:ITranca | null = null;
  ngOnInit() {

  }
ngOnChanges(changes: SimpleChanges): void {
    this.trancas.sort((a, b) => a.id - b.id);
    this.tranca=this.obtenerTrancaClick();
    this.fecha=this.obtenerFechaClick();
    console.log('Posición del componente:', this.position);
    console.log('Ancho del componente:', this.ancho);
    console.log('Alto del componente:', this.alto);
    console.log('Columnas del componente:', this.columnas);
    console.log('Filas del componente:', this.filas);
    console.log('Semanas:', this.semanas);
    console.log('Lista de turnos:', this.listaTurnos);
    console.log('Trancas:', this.trancas);
    console.log(this.fecha);
    console.log(this.tranca);
}
  esCampoInvalido(event:any): boolean {

    return false;
  }
  ocultarDialogo(){
    this.estadoDialogo.emit(false);
  }
  public obtenerFechaClick(): Date | null {
    if (!this.semanas || this.semanas.length === 0 || this.ancho <= 0) {
      console.error('Datos insuficientes para calcular la fecha.');
      return null;
    }
  
    // Calcular el índice de la columna según la posición horizontal del clic
    const columnaIndex = Math.floor((this.position.left) / this.ancho);
    console.log('Índice de columna calculado:', columnaIndex);
    // Verificar si el índice está dentro del rango de fechas disponibles
    if (columnaIndex > 0 && columnaIndex <= this.semanas.length) {
      return this.semanas[columnaIndex-1]; // Retornar la fecha correspondiente
    }
  
    console.error('El clic está fuera del rango de columnas.');
    return null;
  }
  public obtenerTrancaClick(): ITranca | null {
    if (!this.trancas || this.trancas.length === 0 || this.alto <= 0) {
      console.error('Datos insuficientes para calcular la tranca.');
      return null;
    }
  
    // Calcular el índice de la fila según la posición vertical del clic
    const filaIndex = Math.floor(this.position.top / this.alto);
    console.log('Índice de fila calculado:', filaIndex);
  
    // Verificar si el índice está dentro del rango de trancas disponibles
    if (filaIndex > 0 && filaIndex <= this.trancas.length) {
      return this.trancas[filaIndex-1]; // Retornar la tranca correspondiente
    }
  
    console.error('El clic está fuera del rango de filas.');
    return null;
  }
}
