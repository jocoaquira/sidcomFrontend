import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnularFormularioInternoCooperativaComponent } from './anular-formulario-interno-cooperativa.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextareaModule,
    ReactiveFormsModule,
    ButtonModule,
    TabMenuModule,
    ConfirmDialogModule
  ],
  declarations: [AnularFormularioInternoCooperativaComponent],
  providers: [ConfirmationService, MessageService]
})
export class AnularFormularioInternoCooperativaModule { }
