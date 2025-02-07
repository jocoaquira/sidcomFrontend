import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioExternoComponent } from './formulario-externo.component';
import { CreateFormularioExternoComponent } from './create-formulario-externo/create-formulario-externo.component';
import { EditFormularioExternoComponent } from './edit-formulario-externo/edit-formulario-externo.component';
import { AnularFormularioExternoComponent } from './anular-formulario-externo/anular-formulario-externo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FormularioExternoComponent },
		{path:'crear',component:CreateFormularioExternoComponent},
		{path:'editar/:id',component:EditFormularioExternoComponent},
		{path:'anular/:id',component:AnularFormularioExternoComponent}
	])],
	exports: [RouterModule]
})
export class FormularioExternoRoutingModule { }
