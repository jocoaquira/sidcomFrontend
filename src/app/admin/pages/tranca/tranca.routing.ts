import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarTrancaComponent } from './listar-tranca/listar-tranca.component';
import { CrearTrancaComponent } from './crear-tranca/crear-tranca.component';
import { EditarTrancaComponent } from './editar-tranca/editar-tranca.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarTrancaComponent },
		{path:'crear',component:CrearTrancaComponent},
        {path:'editar/:id',component:EditarTrancaComponent},
	])],
	exports: [RouterModule]
})
export class TrancaRoutingModule { }
