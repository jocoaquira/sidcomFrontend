import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnularFormularioTrasladoColaComponent } from './anular-formulario-traslado-cola.component';

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
  declarations: [AnularFormularioTrasladoColaComponent],
  providers: [ConfirmationService, MessageService]
})
export class AnularFormularioTrasladoColaModule { }
