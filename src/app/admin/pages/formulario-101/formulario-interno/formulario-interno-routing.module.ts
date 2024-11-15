import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioInternoComponent } from './formulario-interno.component';
import { CreateFormularioInternoComponent } from './create-formulario-interno/create-formulario-interno.component';
import { EditFormularioInternoComponent } from './edit-formulario-interno/edit-formulario-interno.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FormularioInternoComponent },
		{path:'crear',component:CreateFormularioInternoComponent},
		{path:'editar',component:EditFormularioInternoComponent},
	])],
	exports: [RouterModule]
})
export class OperatorRoutingModule { }
