
import { CommonModule } from '@angular/common';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CrearPaisModule } from 'src/app/admin/components/crear-pais/crear-pais.module';
import { RouterModule } from '@angular/router';
import { ListarTrancaComponent } from './listar-tranca.component';


@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports:[
    ],
    imports: [
        CommonModule,
        TableModule,
        RouterModule,
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
        CrearPaisModule,
        ConfirmDialogModule
    ],
    declarations: [ListarTrancaComponent],
    providers: [ConfirmationService]
})
export class ListarTrancaModule { }
