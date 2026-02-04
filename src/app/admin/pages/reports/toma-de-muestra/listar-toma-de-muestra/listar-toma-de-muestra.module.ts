import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { ListarTomaDeMuestraComponent } from './listar-toma-de-muestra.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        CalendarModule,
        InputTextModule,
        ToastModule,
        ToolbarModule
    ],
    declarations: [ListarTomaDeMuestraComponent],
    exports: [ListarTomaDeMuestraComponent]
})
export class ListarTomaDeMuestraModule { }
