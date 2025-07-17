import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioInternoComponent } from './formulario-interno.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { CreateFormularioInternoModule } from './create-formulario-interno/create-formulario-interno.module';
import { FormularioInternoRoutingModule } from './formulario-interno.routing';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AnularFormularioInternoModule } from './anular-formulario-interno/anular-formulario-interno.module';
import { EditFormularioInternoModule } from './edit-formulario-interno/edit-formulario-interno.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TrancaDetailComponent } from '../components/control-tranca-detalle.component';

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
    CreateFormularioInternoModule,
    AnularFormularioInternoModule,
    EditFormularioInternoModule,
    FormularioInternoRoutingModule,
    ConfirmDialogModule,
    DynamicDialogModule
  ],
  declarations: [
    FormularioInternoComponent,
    TrancaDetailComponent
],
providers: [
    DialogService
  ]
})
export class FormularioInternoModule { }
