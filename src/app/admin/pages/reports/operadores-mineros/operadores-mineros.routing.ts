import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarOperadoresMinerosComponent } from './listar-operadores-mineros/listar-operadores-mineros.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ListarOperadoresMinerosComponent },
  ])],
  exports: [RouterModule]
})
export class OperadoresMinerosRoutingModule { }
