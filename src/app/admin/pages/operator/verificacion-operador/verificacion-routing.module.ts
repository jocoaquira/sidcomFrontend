import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificacionOperadorComponent } from './verificacion-operador.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: ':hash', component: VerificacionOperadorComponent }
    ])],
    exports: [RouterModule]
})
export class VerificacionRoutingModule { }
