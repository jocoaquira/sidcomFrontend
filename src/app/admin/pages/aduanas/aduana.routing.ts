import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarAduanaComponent } from './listar-aduanas/listar-aduanas.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarAduanaComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class AduanaRoutingModule { }
