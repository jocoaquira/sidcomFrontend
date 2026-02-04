import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarFormulariosExternosComponent } from './listar-formularios-externos/listar-formularios-externos.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ListarFormulariosExternosComponent },
  ])],
  exports: [RouterModule]
})
export class FormulariosExternosRoutingModule { }
