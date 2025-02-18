import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioExternoComponent } from './formulario-externo.component';
import { CreateFormularioExternoComponent } from './create-formulario-externo/create-formulario-externo.component';
import { EditFormularioExternoComponent } from './edit-formulario-externo/edit-formulario-externo.component';
import { AnularFormularioExternoComponent } from './anular-formulario-externo/anular-formulario-externo.component';
import { CanVerFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-ver-formulario-externo.guard';
import { CanCrearFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-crear-formulario-externo.guard';
import { CanEditarFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-editar-formulario-externo.guard';
import { CanAnularFormularioExternoGuard } from 'src/app/admin/guards/formulario-externos/can-anular-formulario-externo.guard';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FormularioExternoComponent,
					canActivate:[CanVerFormularioExternoGuard] },
		{
			path:'crear',component:CreateFormularioExternoComponent,
			canActivate:[CanCrearFormularioExternoGuard]
		},
		{
			path:'editar/:id',component:EditFormularioExternoComponent,
			canActivate:[CanEditarFormularioExternoGuard]
		},
		{
			path:'anular/:id',component:AnularFormularioExternoComponent,
			canActivate:[CanAnularFormularioExternoGuard]
		}
	])],
	exports: [RouterModule]
})
export class FormularioExternoRoutingModule { }
