import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarCompradorComponent } from './listar-comprador/listar-comprador.component';
import { CrearCompradorComponent } from './crear-comprador/crear-comprador.component';
import { EditarCompradorComponent } from './editar-comprador/editar-comprador.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarCompradorComponent },
		{path:'crear',component:CrearCompradorComponent},
        {path:'editar/:id',component:EditarCompradorComponent},
	])],
	exports: [RouterModule]
})
export class CompradorRoutingModule { }
