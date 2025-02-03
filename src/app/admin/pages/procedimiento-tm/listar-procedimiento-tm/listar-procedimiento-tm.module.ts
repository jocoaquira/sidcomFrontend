
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
import { CrearProcedimientoModule } from 'src/app/admin/components/crear-procedimiento/crear-procedimiento.module';
import { ListarResponsableTMComponent } from '../../responsable-tm/listar-responsable-tm/listar-responsable-tm.component';
import { ListarProcedimientoTMComponent } from './listar-procedimiento-tm.component';


@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports:[
    ],
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
        CrearProcedimientoModule,
    ],
    declarations: [ListarProcedimientoTMComponent],
})
export class ListarProcedimientoTMModule { }
