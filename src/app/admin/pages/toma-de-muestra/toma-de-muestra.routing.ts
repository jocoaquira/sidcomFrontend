import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnularTomaDeMuestraComponent } from './anular-toma-de-muestra/anular-toma-de-muestra.component';
import { CrearTomaDeMuestraComponent } from './crear-toma-de-muestra/crear-toma-de-muestra.component';
import { EditarTomaDeMuestraComponent } from './editar-toma-de-muestra/editar-toma-de-muestra.component';
import { ListaTomaDeMuestraComponent } from './lista-toma-de-muestra/lista-toma-de-muestra.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListaTomaDeMuestraComponent },
		{path:'crear',component:CrearTomaDeMuestraComponent},
		{path:'editar/:id',component:EditarTomaDeMuestraComponent},
		{path:'anular/:id',component:AnularTomaDeMuestraComponent}
	])],
	exports: [RouterModule]
})
export class TomaDeMuestraRoutingModule { }
