import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarChoferComponent } from './listar-choferes/listar-choferes.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarChoferComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class ChoferRoutingModule { }
