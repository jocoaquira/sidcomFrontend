import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlarTrancaComponent } from './controlar-tranca/controlar-tranca.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ControlarTrancaComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class ControlTrancaRoutingModule { }
