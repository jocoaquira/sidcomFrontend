import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarPermisoComponent } from './listar-permisos/listar-permisos.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarPermisoComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class PermisoRoutingModule { }
