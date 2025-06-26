import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarControlTrancaComponent } from './listar-control-tranca/listar-control-tranca.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarControlTrancaComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class ControlTrancaRoutingModule { }
