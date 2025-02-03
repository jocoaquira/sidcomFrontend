import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { AppLayoutComponent } from './layout/app.layout.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
        path:'', component: AppLayoutComponent,
        canActivate:[AdminGuard,AuthGuard],
        children:[
        { path: 'operador', loadChildren: () => import('./pages/operator/operator.module').then(m => m.OperatorModule) },
        { path: 'usuario', loadChildren: () => import('./pages/usuario/usuario.module').then(m => m.UsuarioModule) },
        { path: 'formulario-101', loadChildren: () => import('./pages/formulario-101/formulario-101.module').then(m => m.Formulario101Module) },
        { path: 'toma-de-muestra', loadChildren: () => import('./pages/toma-de-muestra/toma-de-muestra.module').then(m => m.TomaDeMuestraModule) },
        { path: 'responsable-tm', loadChildren: () => import('./pages/responsable-tm/responsable-tm.module').then(m => m.ResponsableTMModule) },
        { path: 'responsable-senarecom', loadChildren: () => import('./pages/responsable-senarecom/responsable-senarecom.module').then(m => m.ResponsableSenarecomModule) },
        { path: 'procedimiento-tm', loadChildren: () => import('./pages/procedimiento-tm/procedimiento-tm.module').then(m => m.ProcedimientoTMModule) },
        
        { path: '**', redirectTo: '/notfound' }
        ]
        }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
