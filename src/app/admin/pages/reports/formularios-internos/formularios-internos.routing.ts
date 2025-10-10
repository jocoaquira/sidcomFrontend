import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarFormulariosInternosComponent } from './listar-formularios-internos/listar-formularios-internos.component';
@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListarFormulariosInternosComponent },
	])],
	exports: [RouterModule]
})
export class FormulariosInternosRoutingModule { }
