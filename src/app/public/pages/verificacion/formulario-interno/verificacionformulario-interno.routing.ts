import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificacionFormularioInternoComponent } from './formulario-interno.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: VerificacionFormularioInternoComponent }
    ])],
    exports: [RouterModule]
})
export class VerificacionFormularioInternoRoutingModule { }
