import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificacionFormularioTDMComponent } from './formulario-tdm.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: VerificacionFormularioTDMComponent }
    ])],
    exports: [RouterModule]
})
export class VerificacionFormularioTDMRoutingModule { }
