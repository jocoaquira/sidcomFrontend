import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarVehiculoComponent } from './listar-vehiculos/listar-vehiculos.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarVehiculoComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class VehiculoRoutingModule { }
