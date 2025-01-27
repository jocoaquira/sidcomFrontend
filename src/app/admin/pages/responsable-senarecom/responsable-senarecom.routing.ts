import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarResponsableSenarecomComponent } from './listar-responsable-senarecom/listar-responsable-senarecom.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarResponsableSenarecomComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class ResponsableSenarecomRoutingModule { }
