import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ListarFormularioCooperativaComponent } from './listar_formintcoope.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TrancaDetailComponent } from './components/control-tranca-detalle.component';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ToolbarModule,
    TableModule,
    ToastModule,
    ButtonModule,
    BadgeModule,
    TagModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
    DynamicDialogModule
  ],
  declarations: [
    ListarFormularioCooperativaComponent,
    TrancaDetailComponent
],
providers: [
    DialogService,
    ConfirmationService
  ]
})
export class ListarFormularioCooperativaModule { }
