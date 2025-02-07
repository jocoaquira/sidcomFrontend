import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnularFormularioInternoComponent } from './anular-formulario-interno.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
  declarations: [AnularFormularioInternoComponent],
  providers: [ConfirmationService, MessageService]
})
export class AnularFormularioInternoModule { }
