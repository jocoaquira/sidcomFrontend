import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificacionFormularioTrasladoColaComponent } from './formulario-cola.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: VerificacionFormularioTrasladoColaComponent }
    ])],
    exports: [RouterModule]
})
export class VerificacionFormularioTrasladoColaRoutingModule { }
