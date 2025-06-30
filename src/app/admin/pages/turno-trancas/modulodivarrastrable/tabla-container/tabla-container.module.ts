import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaContainerComponent } from './tabla-container.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CabeceraFechaModule } from '../cabecera-fecha/cabecera-fecha.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    CabeceraFechaModule
  ],
  declarations: [TablaContainerComponent],
  exports: [
    TablaContainerComponent // Si necesitas usarlo en otros módulos
    ]
})
export class TablaContainerModule { }
