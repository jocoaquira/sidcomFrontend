import { FormularioTrasladoColaRoutingModule } from './formulario-traslado-cola.routing';
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
import { FormularioTrasladoColaComponent } from './formulario-traslado-cola.component';
import { CreateFormularioTrasladoColaModule } from './create-formulario-traslado-cola/create-formulario-traslado-cola.module';
import { AnularFormularioTrasladoColaModule } from './anular-formulario-interno/anular-formulario-traslado-cola.module';
import { EditFormularioTrasladoColaModule } from './edit-formulario-traslado-cola/edit-formulario-traslado-cola.module';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TrancaDetailComponent } from './components/control-tranca-detalle.component';

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
    CreateFormularioTrasladoColaModule,
    EditFormularioTrasladoColaModule,
    AnularFormularioTrasladoColaModule,
    FormularioTrasladoColaRoutingModule,
    ConfirmDialogModule,
    DynamicDialogModule
  ],
  declarations: [
    FormularioTrasladoColaComponent,
    TrancaDetailComponent
],
providers: [
    DialogService
  ]
})
export class FormularioTrasladoColaModule { }
