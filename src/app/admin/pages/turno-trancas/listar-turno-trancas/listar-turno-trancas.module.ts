import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { ToolbarModule } from 'primeng/toolbar';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ListarTurnoTrancaComponent } from './listar-turno-trancas.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ListaTurnoTrancaFechaModule } from '../moduloListaTurnoTrancaFecha/lista-turno-tranca-fecha.module';
import { ListaTurnoUsuarioFechaModule } from '../moduloListaTurnoUsuarioFecha/lista-turno-usuario-fecha.module';
@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ListarTurnoTrancaComponent,
  ],

  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ToolbarModule,
    ToastModule,
    TabViewModule,
    ProgressSpinnerModule,
    MessagesModule,
    TagModule,
    TooltipModule,
    CalendarModule,
    ListaTurnoTrancaFechaModule,
    ListaTurnoUsuarioFechaModule

  ],
  exports: [
    ListarTurnoTrancaComponent,

  ],
  providers: [
    DatePipe,
    TurnoTrancaService,
    MessageService
  ],
})
export class ListarTurnoTrancasModule { }
