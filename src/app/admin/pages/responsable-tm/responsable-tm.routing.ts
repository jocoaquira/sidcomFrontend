import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarResponsableTMComponent } from './listar-responsable-tm/listar-responsable-tm.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarResponsableTMComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class ResponsableTMRoutingModule { }
