import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarMineralComponent } from './listar-minerales/listar-minerales.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarMineralComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class MineralRoutingModule { }
