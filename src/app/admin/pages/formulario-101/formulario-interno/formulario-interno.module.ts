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
    FormularioInternoRoutingModule,

  ],
  declarations: [
    FormularioInternoComponent
]
})
export class FormularioInternoModule { }
