import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioExternoComponent } from './formulario-externo.component';
import { CreateFormularioExternoComponent } from './create-formulario-externo/create-formulario-externo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FormularioExternoComponent },
		{path:'crear',component:CreateFormularioExternoComponent},
		{path:'editar',component:CreateFormularioExternoComponent},
	])],
	exports: [RouterModule]
})
export class OperatorRoutingModule { }
