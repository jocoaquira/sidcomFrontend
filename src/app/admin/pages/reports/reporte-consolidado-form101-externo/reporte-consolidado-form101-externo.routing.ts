import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReporteConsolidadoForm101ExternoComponent } from './reporte-consolidado-form101-externo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ReporteConsolidadoForm101ExternoComponent }
    ])],
    exports: [RouterModule]
})
export class ReporteConsolidadoForm101ExternoRoutingModule { }
