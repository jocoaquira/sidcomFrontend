import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnularTomaDeMuestraComponent } from './anular-toma-de-muestra.component';

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
  declarations: [AnularTomaDeMuestraComponent],
  providers: [ConfirmationService, MessageService]
})
export class AnularTomaDeMuestraModule { }
