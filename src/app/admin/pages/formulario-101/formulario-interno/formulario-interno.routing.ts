import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateFormularioInternoComponent } from './create-formulario-interno/create-formulario-interno.component';
import { FormularioInternoComponent } from './formulario-interno.component';
import { AnularFormularioInternoComponent } from './anular-formulario-interno/anular-formulario-interno.component';
import { EditFormularioInternoComponent } from './edit-formulario-interno/edit-formulario-interno.component';
import { CanVerFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-ver-formulario-interno.guard';
import { CanCrearFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-crear-formulario-interno.guard';
import { CanEditarFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-editar-formulario-interno.guard';
import { CanAnularFormularioInternoGuard } from 'src/app/admin/guards/formulario-internos/can-anular-formulario-interno.guard';
import { ListarFormularioInternoComponent } from './listar-formint/listar_formint.component';

@NgModule({
	imports: [RouterModule.forChild([
		{
			path: '', component:ListarFormularioInternoComponent ,
			canActivate:[CanVerFormularioInternoGuard]
		 },
		{
			path:'crear',component:CreateFormularioInternoComponent,
			canActivate:[CanCrearFormularioInternoGuard]
		},
		{
			path:'editar/:id',component:EditFormularioInternoComponent,
			canActivate:[CanEditarFormularioInternoGuard]
		},
		{
			path:'anular/:id',component:AnularFormularioInternoComponent,
			canActivate:[CanAnularFormularioInternoGuard]
		},
        {
			path: 'listar', component: FormularioInternoComponent,
			canActivate:[CanVerFormularioInternoGuard]
		 },
	])],
	exports: [RouterModule]
})
export class FormularioInternoRoutingModule { }
