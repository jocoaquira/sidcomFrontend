import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarLugarVerificacionTDMComponent } from './listar-lugar-verificacion-tdm/listar-lugar-verificacion-tdm.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarLugarVerificacionTDMComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class LugarVerificacionTDMRoutingModule { }
