import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaContainerComponent } from './tabla-container.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { CabeceraFechaModule } from '../../components/cabecera-fecha/cabecera-fecha.module';
import { CrearTurnoModule } from '../../components/crear-turno/crear-turno.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    CabeceraFechaModule,
    DialogModule,
    CrearTurnoModule
  ],
  declarations: [TablaContainerComponent],
  exports: [
    TablaContainerComponent // Si necesitas usarlo en otros módulos
    ]
})
export class TablaContainerModule { }
