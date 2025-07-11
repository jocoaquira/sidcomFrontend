import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { CabeceraFechaModule } from '../components/cabecera-fecha/cabecera-fecha.module';
import { CrearTurnoModule } from '../components/crear-turno/crear-turno.module';
import { ListaTurnoTrancaFechaComponent } from './lista-turno-tranca-fecha.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    CabeceraFechaModule,
    DialogModule,
    CrearTurnoModule
  ],
  declarations: [ListaTurnoTrancaFechaComponent],
  exports: [
    ListaTurnoTrancaFechaComponent // Si necesitas usarlo en otros módulos
    ]
})
export class ListaTurnoTrancaFechaModule { }
