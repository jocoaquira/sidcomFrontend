import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarTurnoTrancaComponent } from './listar-turno-trancas/listar-turno-trancas.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListarTurnoTrancaComponent },
    ])],
    exports: [RouterModule]
})
export class TurnoTrancaRoutingModule { }
