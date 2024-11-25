import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnularFormularioInternoComponent } from './anular-formulario-interno.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  declarations: [AnularFormularioInternoComponent]
})
export class AnularFormularioInternoModule { }
