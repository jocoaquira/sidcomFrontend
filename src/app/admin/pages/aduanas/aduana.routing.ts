import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarAduanaComponent } from './listar-aduanas/listar-aduanas.component';
import { CrearAduanaComponent } from './crear-aduana/crear-aduana.component';
import { EditarAduanaComponent } from './editar-aduana/editar-aduana.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarAduanaComponent },
		{path:'crear',component:CrearAduanaComponent},
		{path:'editar/:id',component:EditarAduanaComponent}
	])],
	exports: [RouterModule]
})
export class AduanaRoutingModule { }
