import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificacionFormularioExternoComponent } from './formulario-externo.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: VerificacionFormularioExternoComponent }
    ])],
    exports: [RouterModule]
})
export class VerificacionFormularioExternoRoutingModule { }
