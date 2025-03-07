import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioInternoCooperativaComponent } from './formulario-interno-cooperativa.component';
import { CreateFormularioInternoCooperativaComponent } from './create-formulario-interno-cooperativa/create-formulario-interno-cooperativa.component';
import { EditFormularioInternoCooperativaComponent } from './edit-formulario-interno-cooperativa/edit-formulario-interno-cooperativa.component';
import { AnularFormularioInternoCooperativaComponent } from './anular-formulario-interno-cooperativa/anular-formulario-interno-cooperativa.component';
import { CanVerFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-ver-formulario-cooperativa.guard';
import { CanCrearFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-crear-formulario-cooperativa.guard';
import { CanEditarFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-editar-formulario-cooperativa.guard';
import { CanAnularFormularioCooperativaGuard } from 'src/app/admin/guards/formulario-cooperativas/can-anular-formulario-cooperativa.guard';

@NgModule({
	imports: [RouterModule.forChild([
		{ 
			path: '', component: FormularioInternoCooperativaComponent,
			canActivate:[CanVerFormularioCooperativaGuard]
		 },
		{
			path:'crear',component:CreateFormularioInternoCooperativaComponent,
			canActivate:[CanCrearFormularioCooperativaGuard]
		},
		{
			path:'editar/:id',component:EditFormularioInternoCooperativaComponent,
			canActivate:[CanEditarFormularioCooperativaGuard]
		},
		{
			path:'anular/:id',component:AnularFormularioInternoCooperativaComponent,
			canActivate:[CanAnularFormularioCooperativaGuard]
		}
	])],
	exports: [RouterModule]
})
export class FormularioInternoCooperativaRoutingModule { }
