import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateFormularioInternoComponent } from './create-formulario-interno/create-formulario-interno.component';
import { FormularioInternoComponent } from './formulario-interno.component';
import { AnularFormularioInternoComponent } from './anular-formulario-interno/anular-formulario-interno.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FormularioInternoComponent },
		{path:'crear',component:CreateFormularioInternoComponent},
		{path:'anular/:id',component:AnularFormularioInternoComponent}
	])],
	exports: [RouterModule]
})
export class FormularioInternoRoutingModule { }
