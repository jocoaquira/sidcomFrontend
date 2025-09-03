import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
// IMPORTACIONES FALTANTES AÑADIDAS:
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';

import { ControlarTrancaComponent } from './controlar-tranca.component';
import { FormIntCopesModule } from '../components/form-int-copes/form-int-copes.module';
import { FormExtModule } from '../components/form-ext/form-ext.module';
import { FormIntModule } from '../components/form-int/form-int.module';
import { FormColaModule } from '../components/form-cola/form-cola.module';
import { FormTDMModule } from '../components/form-tdm/form-tdm.module';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [],
    imports: [
        CommonModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        BadgeModule,
        TagModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        ConfirmDialogModule,
        // MÓDULOS AÑADIDOS:
        ProgressSpinnerModule,
        CardModule,
        // Módulos de componentes
        FormIntCopesModule,
        FormExtModule,
        FormIntModule,
        FormColaModule,
        FormTDMModule
    ],
    declarations: [ControlarTrancaComponent],
    providers: [ConfirmationService]
})
export class ControlarTrancaModule { }
