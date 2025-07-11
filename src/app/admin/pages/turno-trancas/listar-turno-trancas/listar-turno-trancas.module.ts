import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ListarTurnoTrancaComponent } from './listar-turno-trancas.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TablaContainerModule } from '../modulodivarrastrable/tabla-container/tabla-container.module';
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
    TableModule,
    ToastModule,
    ProgressSpinnerModule,
    MessagesModule,
    TagModule,
    TooltipModule,
    CalendarModule,
    TablaContainerModule

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
