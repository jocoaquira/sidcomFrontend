import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaTomaDeMuestraComponent } from './lista-toma-de-muestra.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AprobarProcedimientoModule } from 'src/app/admin/components/aprobar-procedimiento/aprobar-procedimiento.module';
import { DialogModule } from 'primeng/dialog';
import { VerTomaDeMuestraModule } from 'src/app/admin/components/ver-components/ver-toma-de-muestra/ver-toma-de-muestra.module';
import { AnularTomaDeMuestraModule } from '../anular-toma-de-muestra/anular-toma-de-muestra.module';

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule,
    TableModule,
    ToastModule,
    ButtonModule,
    BadgeModule,
    TagModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
    RouterModule,
    DialogModule,
    AprobarProcedimientoModule,
    VerTomaDeMuestraModule,
    AnularTomaDeMuestraModule
  ],
  declarations: [ListaTomaDeMuestraComponent],
    providers: [ConfirmationService]
})
export class ListaTomaDeMuestraModule { }
