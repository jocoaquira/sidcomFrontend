import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarPaisComponent } from './listar-paises/listar-paises.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarPaisComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class PaisRoutingModule { }
