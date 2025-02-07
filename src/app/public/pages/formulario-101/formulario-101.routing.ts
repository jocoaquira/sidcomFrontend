import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
@NgModule({
	imports: [RouterModule.forChild([
		{
            path:'',
            canActivate:[AuthGuard],
            children:[
            { path: 'formulario-interno', loadChildren: () => import('./formulario-interno/formulario-interno.module').then(m => m.FormularioInternoModule) },
            //{ path: 'formulario-externo', loadChildren: () => import('./formulario-externo/formulario-externo.module').then(m => m.FormularioExternoModule) },
            //{ path: 'formulario-cooperativa', loadChildren: () => import('./formulario-cooperativas/formulario-cooperativas.module').then(m => m.FormularioCooperativasModule) },
            { path: '**', redirectTo: '/notfound' }
            ]
        }])],
	exports: [RouterModule]
})
export class Formulario101RoutingModule { }
