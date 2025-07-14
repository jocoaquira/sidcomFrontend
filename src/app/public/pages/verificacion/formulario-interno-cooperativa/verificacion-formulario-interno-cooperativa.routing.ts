import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificacionFormularioInternoCooperativaComponent } from './formulario-interno-cooperativa.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: VerificacionFormularioInternoCooperativaComponent }
    ])],
    exports: [RouterModule]
})
export class VerificacionFormularioInternoCooperativaRoutingModule { }
