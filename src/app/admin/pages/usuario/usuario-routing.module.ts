import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarUsuarioComponent } from './listar-usuarios/listar-usuario.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarUsuarioComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class UsuarioRoutingModule { }
