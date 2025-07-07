import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-crear-turno',
  templateUrl: './crear-turno.component.html',
  styleUrls: ['./crear-turno.component.scss']
})
export class CrearTurnoComponent implements OnInit {
  @Input() position: { top?: number; left?: number } = { top: 0, left: 0 };
  @Input() ancho: number = 0;
  @Input() alto: number = 0;
  @Input() columnas: number = 0;
  @Input() filas: number = 0;
  public error: any=null;
  ngOnInit() {

  }
ngOnChanges(changes: SimpleChanges): void {
    console.log('Posición del componente:', this.position);
    console.log('Ancho del componente:', this.ancho);
    console.log('Alto del componente:', this.alto);
    console.log('Columnas del componente:', this.columnas);
    console.log('Filas del componente:', this.filas);
}
  esCampoInvalido(event:any): boolean {

    return false;
  }
}
