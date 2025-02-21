import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarMunicipioComponent } from './listar-municipios/listar-municipios.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarMunicipioComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class MunicipioRoutingModule { }
