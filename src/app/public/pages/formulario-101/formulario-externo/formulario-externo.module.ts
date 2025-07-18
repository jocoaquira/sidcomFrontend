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
import { CreateFormularioExternoModule } from './create-formulario-externo/create-formulario-externo.module';
import { AnularFormularioExternoModule } from './anular-formulario-externo/anular-formulario-externo.module';
import { EditFormularioExternoModule } from './edit-formulario-externo/edit-formulario-externo.module';
import { FormularioExternoRoutingModule } from './formulario-externo.routing';
import { FormularioExternoComponent } from './formulario-externo.component';
import { PaisSelectModule } from 'src/app/admin/components/paisSelect/paisSelect.module';
import { AduanaSelectModule } from 'src/app/admin/components/aduanaSelect/aduanaSelect.module';
import { TrancaDetailComponent } from '../components/control-tranca-detalle.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

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
    CreateFormularioExternoModule,
    AnularFormularioExternoModule,
    EditFormularioExternoModule,
    FormularioExternoRoutingModule,
    ConfirmDialogModule,
    DynamicDialogModule

  ],
  declarations: [
    FormularioExternoComponent
],
providers: [
    DialogService
  ]
})
export class FormularioExternoModule { }
