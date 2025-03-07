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
import { FormularioInternoCooperativaComponent } from './formulario-interno-cooperativa.component';
import { CreateFormularioInternoCooperativaModule } from './create-formulario-interno-cooperativa/create-formulario-interno-cooperativa.module';
import { AnularFormularioInternoCooperativaModule } from './anular-formulario-interno-cooperativa/anular-formulario-interno-cooperativa.module';
import { EditFormularioInternoCooperativaModule } from './edit-formulario-interno-cooperativa/edit-formulario-interno-cooperativa.module';
import { FormularioInternoCooperativaRoutingModule } from './formulario-interno-cooperativa.routing';

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
    CreateFormularioInternoCooperativaModule,
    AnularFormularioInternoCooperativaModule,
    EditFormularioInternoCooperativaModule,
    FormularioInternoCooperativaRoutingModule,
    ConfirmDialogModule
  ],
  declarations: [
    FormularioInternoCooperativaComponent
]
})
export class FormularioInternoCooperativaModule { }
