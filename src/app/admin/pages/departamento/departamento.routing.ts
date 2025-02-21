import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarDepartamentoComponent } from './listar-departamentos/listar-departamentos.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarDepartamentoComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class DepartamentoRoutingModule { }
