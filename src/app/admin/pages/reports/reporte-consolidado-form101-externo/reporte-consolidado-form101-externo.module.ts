import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ReporteConsolidadoForm101ExternoComponent } from './reporte-consolidado-form101-externo.component';
import { ReporteConsolidadoForm101ExternoRoutingModule } from './reporte-consolidado-form101-externo.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToolbarModule,
        ReporteConsolidadoForm101ExternoRoutingModule
    ],
    declarations: [ReporteConsolidadoForm101ExternoComponent]
})
export class ReporteConsolidadoForm101ExternoModule { }


