import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarFormulariosComponent } from './listar-formularios/listar-formularios.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarFormulariosComponent },
		//{path:'crear',component:OpeCrearradorComponent}
	])],
	exports: [RouterModule]
})
export class FormulariosRoutingModule { }
