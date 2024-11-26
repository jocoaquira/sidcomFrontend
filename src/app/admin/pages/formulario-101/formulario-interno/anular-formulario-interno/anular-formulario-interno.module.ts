import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnularFormularioInternoComponent } from './anular-formulario-interno.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ButtonModule,
    TabMenuModule
  ],
  declarations: [AnularFormularioInternoComponent]
})
export class AnularFormularioInternoModule { }
