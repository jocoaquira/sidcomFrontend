import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CanVerFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-ver-formulario-cola.guard';
import { CreateFormularioTrasladoColaComponent } from './create-formulario-interno/create-formulario-traslado-cola.component';
import { CanCrearFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-crear-formulario-cola.guard';
import { CanEditarFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-editar-formulario-cola.guard';
import { CanAnularFormularioColasGuard } from 'src/app/admin/guards/formulario-colas/can-anular-formulario-cola.guard';
import { FormularioTrasladoColaComponent } from './formulario-traslado-cola.component';
import { EditFormularioTrasladoColaComponent } from './edit-formulario-interno/edit-formulario-traslado-cola.component';
import { AnularFormularioTrasladoColaComponent } from './anular-formulario-interno/anular-formulario-traslado-cola.component';

@NgModule({
	imports: [RouterModule.forChild([
		{
			path: '', component: FormularioTrasladoColaComponent,
			canActivate:[CanVerFormularioColasGuard]
		 },
		{
			path:'crear',component:CreateFormularioTrasladoColaComponent,
			canActivate:[CanCrearFormularioColasGuard]
		},
		{
			path:'editar/:id',component:EditFormularioTrasladoColaComponent,
			canActivate:[CanEditarFormularioColasGuard]
		},
		{
			path:'anular/:id',component:AnularFormularioTrasladoColaComponent,
			canActivate:[CanAnularFormularioColasGuard]
		}
	])],
	exports: [RouterModule]
})
export class FormularioTrasladoColaRoutingModule { }
