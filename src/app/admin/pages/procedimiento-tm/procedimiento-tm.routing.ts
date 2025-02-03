import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarProcedimientoTMComponent } from './listar-procedimiento-tm/listar-procedimiento-tm.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarProcedimientoTMComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class ProcedimientoTMRoutingModule { }
