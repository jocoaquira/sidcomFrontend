import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarTomaDeMuestraComponent } from './listar-toma-de-muestra/listar-toma-de-muestra.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListarTomaDeMuestraComponent },
    ])],
    exports: [RouterModule]
})
export class TomaDeMuestraRoutingModule { }
