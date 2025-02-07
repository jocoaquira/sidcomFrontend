import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarPresentacionComponent } from './listar-presentaciones/listar-presentaciones.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarPresentacionComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class PresentacionRoutingModule { }
