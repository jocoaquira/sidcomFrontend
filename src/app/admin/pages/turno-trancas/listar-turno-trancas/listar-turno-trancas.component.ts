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
  activeIndex: number = 0;

  // Fecha para filtros (ejemplo)
  fechaFiltro: Date = new Date();

  // Variables para manejar estado de carga
  isLoadingTranca: boolean = false;
  isLoadingUsuario: boolean = false;

  constructor(

  ) { }

  ngOnInit(): void {

  }

  onTabChange(event: any): void {
    this.activeIndex = event.index;
    console.log(`Pestaña cambiada a índice: ${event.index}`);

    // Ejecutar acciones específicas según la pestaña
    switch (event.index) {
      case 0:
        //this.onTrancaTabSelected();
        break;
      case 1:
        //this.onUsuarioTabSelected();
        break;
      case 2:
       // this.onConfiguracionTabSelected();
        break;
    }
  }

}
