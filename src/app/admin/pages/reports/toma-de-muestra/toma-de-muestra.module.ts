import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { TomaDeMuestraRoutingModule } from './toma-de-muestra.routing';
import { ListarTomaDeMuestraModule } from './listar-toma-de-muestra/listar-toma-de-muestra.module';

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
        ToolbarModule,
        TomaDeMuestraRoutingModule,
        ListarTomaDeMuestraModule
    ],
    declarations: [],
})
export class TomaDeMuestraModule { }
