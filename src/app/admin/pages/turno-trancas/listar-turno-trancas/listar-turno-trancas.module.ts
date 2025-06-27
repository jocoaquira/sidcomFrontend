import { NgModule } from '@angular/core';
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
@NgModule({
  declarations: [
    ListarTurnoTrancaComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ToolbarModule,
    TableModule,
    ToastModule,
    ProgressSpinnerModule,
    MessagesModule,
    TagModule,
    TooltipModule

  ],
  exports: [
    ListarTurnoTrancaComponent
  ],
  providers: [
    DatePipe,
    TurnoTrancaService,
    MessageService
  ]
})
export class ListarTurnoTrancasModule { }
