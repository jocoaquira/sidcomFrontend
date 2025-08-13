import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarTipoTransporteComponent } from './listar-tipo-transportes/listar-tipo-transporte.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarTipoTransporteComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class TipoTransporteRoutingModule { }
